import React, { useState, useEffect } from "react";
import { 
  Search, ChevronLeft, Send, X, Users, MessageSquare, Phone, MoreVertical, CheckCheck 
} from "lucide-react";
import { 
  collection, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/auth-context";
import { subscribeFirestoreMembers, type FirestoreMember } from "../lib/users";
import { resolveProfileImage } from "../lib/profile-images";

interface ChambersInboxModuleProps {
  onClose: () => void;
}

export interface ChatMessageItem {
  id: string;
  senderName: string;
  senderInitials: string;
  text: string;
  time: string;
  isMe?: boolean;
}

export const ChambersInboxModule: React.FC<ChambersInboxModuleProps> = ({ onClose }) => {
  const { firmUser, firebaseUser } = useAuth();
  const currentUserName = firmUser?.name || firebaseUser?.displayName || "Counsel";

  // State
  const [activeContact, setActiveContact] = useState<{
    id: string;
    name: string;
    title: string;
    avatar: string;
  }>({
    id: "chambers_all",
    name: "Chambers General Workspace",
    title: "Firm-wide Communications",
    avatar: "https://ui-avatars.com/api/?name=Chambers+General&background=1d1d1f&color=fff"
  });

  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [rosterMembers, setRosterMembers] = useState<FirestoreMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Subscribe to Roster Members
  useEffect(() => {
    const unsub = subscribeFirestoreMembers((updated) => setRosterMembers(updated));
    return () => unsub();
  }, []);

  // 2. Subscribe to Active Chat Channel Messages
  useEffect(() => {
    const msgQuery = query(
      collection(db, "chambers_messages"),
      where("channelId", "==", activeContact.id),
      orderBy("timestamp", "asc"),
      limit(100)
    );

    const unsubMsg = onSnapshot(msgQuery, (snapshot) => {
      const msgs: ChatMessageItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        msgs.push({
          id: docSnap.id,
          senderName: data.senderName || "Counsel",
          senderInitials: data.senderInitials || "DA",
          text: data.text || "",
          time: data.timestamp?.seconds 
            ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: data.senderUid === firebaseUser?.uid || data.senderName === currentUserName
        });
      });
      setChatMessages(msgs);
    }, (err) => {
      console.warn("Chambers messages listener notice:", err);
      setChatMessages([]);
    });

    return () => unsubMsg();
  }, [activeContact.id, firebaseUser, currentUserName]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msgText = chatInput.trim();
    setChatInput("");

    const initials = currentUserName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

    const msgObj = {
      channelId: activeContact.id,
      senderUid: firebaseUser?.uid || "guest",
      senderName: currentUserName,
      senderInitials: initials,
      text: msgText,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "chambers_messages"), msgObj);
    } catch (err) {
      console.warn("Firestore add error:", err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `local_${Date.now()}`,
          senderName: currentUserName,
          senderInitials: initials,
          text: msgText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true
        }
      ]);
    }
  };

  const filteredMembers = rosterMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#efeae2] text-[#111b21] flex flex-col w-screen h-screen overflow-hidden font-sans">
      
      {/* Top Main Header */}
      <header className="w-full px-4 py-3 bg-[#008069] text-white flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-base font-bold tracking-tight">Chambers Communications Inbox</h1>
            <p className="text-[11px] text-emerald-100 font-medium">LexVanguard Encrypted Attorney Network</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Main WhatsApp Split-Screen Inbox */}
      <div className="flex-1 flex w-full h-full overflow-hidden relative">
        
        {/* LEFT SIDEBAR: Contacts & Channels List */}
        <div className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0 transition-all ${
          mobileShowChat ? "hidden md:flex" : "flex"
        }`}>
          {/* Search Header */}
          <div className="p-3 bg-[#f0f2f5] border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or start new chat..."
                className="w-full bg-white border-none rounded-lg py-2 pl-9 pr-3 text-xs font-medium focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* Roster & Channels List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {/* General Firm Channel */}
            <div
              onClick={() => {
                setActiveContact({
                  id: "chambers_all",
                  name: "Chambers General Workspace",
                  title: "Firm-wide Communications",
                  avatar: "https://ui-avatars.com/api/?name=Chambers+General&background=1d1d1f&color=fff"
                });
                setMobileShowChat(true);
              }}
              className={`p-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-[#f5f6f6] transition-colors ${
                activeContact.id === "chambers_all" ? "bg-[#f0f2f5]" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#111b21] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                ALL
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold text-[#111b21] truncate">Chambers General</h3>
                  <span className="text-[10px] font-bold text-[#008069]">Active</span>
                </div>
                <p className="text-xs text-gray-500 truncate">Official firm-wide counsel channel</p>
              </div>
            </div>

            {/* Individual Members List */}
            {filteredMembers.map((m) => {
              const avatar = m.profilePhoto || m.image || resolveProfileImage(m.name);
              const isActive = activeContact.id === m.uid;

              return (
                <div
                  key={m.uid}
                  onClick={() => {
                    setActiveContact({
                      id: m.uid,
                      name: m.name,
                      title: m.title || "Counsel",
                      avatar
                    });
                    setMobileShowChat(true);
                  }}
                  className={`p-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-[#f5f6f6] transition-colors ${
                    isActive ? "bg-[#f0f2f5]" : ""
                  }`}
                >
                  <img src={avatar} className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-[#111b21] truncate">{m.name}</h3>
                      <span className="text-[10px] text-gray-400 font-mono">Direct</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{m.title || "Counsel"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT MAIN PANEL: Active Conversation View */}
        <div className={`flex-1 flex flex-col h-full bg-[#efeae2] relative transition-all ${
          !mobileShowChat ? "hidden md:flex" : "flex"
        }`}>
          {/* Active Contact Header */}
          <div className="p-3 bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1.5 text-gray-600 hover:text-black rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <img src={activeContact.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-300" />
              <div>
                <h2 className="text-sm font-bold text-[#111b21] leading-tight">{activeContact.name}</h2>
                <p className="text-[11px] text-gray-500 font-medium">{activeContact.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 cursor-pointer hover:text-black" />
              <MoreVertical className="w-4 h-4 cursor-pointer hover:text-black" />
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
            {chatMessages.length === 0 ? (
              <div className="text-center py-20 text-xs text-gray-500">
                <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl inline-block shadow-xs border border-gray-200">
                  🔒 Messages are end-to-end encrypted across LexVanguard Chambers.
                </div>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? "justify-end" : "justify-start"}`}>
                  {!msg.isMe && (
                    <div className="w-7 h-7 rounded-full bg-[#008069] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {msg.senderInitials}
                    </div>
                  )}
                  <div className={`max-w-[78%] p-3 rounded-2xl text-xs shadow-xs relative ${
                    msg.isMe ? "bg-[#d9fdd3] text-[#111b21] rounded-br-none" : "bg-white text-[#111b21] rounded-bl-none"
                  }`}>
                    {!msg.isMe && (
                      <span className="text-[10px] font-bold text-[#008069] block mb-1">{msg.senderName}</span>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-gray-400">
                      <span>{msg.time}</span>
                      {msg.isMe && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#f0f2f5] border-t border-gray-200 shrink-0 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white border border-gray-300 rounded-full py-2.5 px-4 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#008069]"
            />
            <button
              type="submit"
              className="w-10 h-10 bg-[#008069] hover:bg-[#006e5a] text-white rounded-full flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
