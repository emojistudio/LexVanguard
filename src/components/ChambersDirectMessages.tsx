import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { subscribeFirestoreMembers, FirestoreMember } from "@/lib/users";
import { 
  subscribeMessages, addDirectMessage, deleteDirectMessage, DirectMessage, 
  subscribeMatters, ChambersMatter,
  subscribeDocs, ChambersDocument 
} from "@/lib/office-store";
import { 
  MessageSquare, Send, Paperclip, Briefcase, Trash2, Search, UserCheck, 
  CheckCircle2, Clock, FileText, ChevronRight, Share2, Sparkles, User
} from "lucide-react";

export const ChambersDirectMessages: React.FC = () => {
  const { firmUser, firebaseUser } = useAuth();
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [matters, setMatters] = useState<ChambersMatter[]>([]);
  const [docs, setDocs] = useState<ChambersDocument[]>([]);

  const [selectedRecipientUid, setSelectedRecipientUid] = useState<string>("all");
  const [searchMember, setSearchMember] = useState("");
  const [newMsgText, setNewMsgText] = useState("");
  const [selectedMatterId, setSelectedMatterId] = useState<string>("");
  const [selectedDocTitle, setSelectedDocTitle] = useState<string>("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isCompact, setIsCompact] = useState<boolean>(true);

  useEffect(() => {
    const unsubMembers = subscribeFirestoreMembers((list) => setMembers(list));
    const unsubMsgs = subscribeMessages((list) => setMessages(list));
    const unsubMatters = subscribeMatters((list) => setMatters(list));
    const unsubDocs = subscribeDocs((list) => setDocs(list));

    return () => {
      unsubMembers();
      unsubMsgs();
      unsubMatters();
      unsubDocs();
    };
  }, []);

  const currentUid = firmUser?.id || firebaseUser?.uid || "current_user";
  const currentName = firmUser?.name || "Counsel Member";

  // Filter messages relevant to current selection
  const activeChatMessages = messages.filter((m) => {
    if (selectedRecipientUid === "all") {
      return m.recipientUid === "all";
    }
    return (
      (m.senderUid === currentUid && m.recipientUid === selectedRecipientUid) ||
      (m.senderUid === selectedRecipientUid && m.recipientUid === currentUid)
    );
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const activeRecipient = members.find((m) => m.uid === selectedRecipientUid);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() && !selectedMatterId && !selectedDocTitle) return;

    const linkedMatter = matters.find((m) => m.id === selectedMatterId);

    await addDirectMessage({
      senderUid: currentUid,
      senderName: currentName,
      recipientUid: selectedRecipientUid,
      recipientName: selectedRecipientUid === "all" ? "All Counsel" : (activeRecipient?.name || "Counsel"),
      content: newMsgText.trim(),
      matterId: linkedMatter?.id,
      matterTitle: linkedMatter?.title,
      resourceTitle: selectedDocTitle || undefined,
      resourceUrl: selectedDocTitle ? `#vault-${selectedDocTitle}` : undefined
    });

    setNewMsgText("");
    setSelectedMatterId("");
    setSelectedDocTitle("");
    setShowAttachMenu(false);
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
    (m.title && m.title.toLowerCase().includes(searchMember.toLowerCase()))
  );

  return (
    <div className={`bg-neutral-900 rounded-xs border border-white/10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${
      isCompact ? "max-h-[100px] h-[100px]" : "h-[500px]"
    }`}>
      {/* CONTROL BAR */}
      <div className="bg-black text-white px-4 py-2 flex items-center justify-between text-xs shrink-0 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-yellow-500" />
          <span className="font-extrabold uppercase text-[11px] tracking-widest text-white">
            Chambers Direct Messaging
          </span>
          <span className="text-[9px] text-black bg-yellow-500 px-2 py-0.5 rounded-xs font-extrabold uppercase tracking-widest">
            Online
          </span>
        </div>

        <button
          onClick={() => setIsCompact(!isCompact)}
          className="text-[10px] font-extrabold text-white hover:text-yellow-500 uppercase tracking-widest bg-neutral-900 px-3 py-1 rounded-xs border border-white/10 cursor-pointer transition-colors"
        >
          {isCompact ? "Expand Workspace" : "Minimize"}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* MEMBER DIRECTORY / CHAT THREADS LIST */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-black shrink-0">
          <div className="p-3 border-b border-white/10 bg-neutral-900">
            <h2 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-yellow-500" />
              Counsel Channels
            </h2>
            <div className="relative mt-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search counsel..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-black border border-white/10 rounded-xs text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {/* ALL COUNSEL CHANNEL */}
            <button
              onClick={() => setSelectedRecipientUid("all")}
              className={`w-full p-3 text-left transition flex items-center gap-3 ${
                selectedRecipientUid === "all"
                  ? "bg-yellow-500/10 border-l-4 border-yellow-500 text-white font-bold"
                  : "hover:bg-white/5 text-gray-300"
              }`}
            >
              <div className={`w-8 h-8 rounded-xs flex items-center justify-center font-extrabold text-xs shrink-0 ${
                selectedRecipientUid === "all" ? "bg-yellow-500 text-black" : "bg-white/10 text-yellow-500"
              }`}>
                ALL
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-xs uppercase tracking-wider truncate">Chambers General</span>
                  <span className="text-[9px] text-yellow-500 font-extrabold uppercase">Group</span>
                </div>
              </div>
            </button>

            {/* INDIVIDUAL MEMBERS */}
            {filteredMembers.map((m) => {
              if (m.uid === currentUid) return null;
              const isSelected = selectedRecipientUid === m.uid;
              
              const lastMsg = messages.filter((msg) =>
                (msg.senderUid === currentUid && msg.recipientUid === m.uid) ||
                (msg.senderUid === m.uid && msg.recipientUid === currentUid)
              ).pop();

              return (
                <button
                  key={m.uid}
                  onClick={() => setSelectedRecipientUid(m.uid)}
                  className={`w-full p-3 text-left transition flex items-center gap-3 ${
                    isSelected
                      ? "bg-yellow-500/10 border-l-4 border-yellow-500 text-white font-bold"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  <div className="relative shrink-0">
                    {m.image || m.profilePhoto ? (
                      <img
                        src={m.image || m.profilePhoto}
                        alt={m.name}
                        className="w-8 h-8 rounded-xs object-cover border border-yellow-500/40"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-xs flex items-center justify-center font-extrabold text-xs ${
                        isSelected ? "bg-yellow-500 text-black" : "bg-white/10 text-white"
                      }`}>
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs truncate text-white">{m.name}</span>
                      {lastMsg && <span className="text-[9px] text-gray-500 font-mono">{lastMsg.timeFormatted}</span>}
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{m.title || "Counsel"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAT MESSAGES WINDOW */}
        <div className="flex-1 flex flex-col bg-neutral-950">
          {/* CHAT HEADER */}
          <div className="p-3.5 bg-black border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-yellow-500 text-black flex items-center justify-center font-extrabold text-xs">
                {selectedRecipientUid === "all" ? "ALL" : activeRecipient?.name.slice(0, 2).toUpperCase() || "CN"}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  {selectedRecipientUid === "all" ? "Chambers General Channel" : activeRecipient?.name}
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-xs border border-emerald-500/30 uppercase tracking-widest">
                    <UserCheck className="w-3 h-3" /> Active Now
                  </span>
                </h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {selectedRecipientUid === "all"
                    ? "Firm-wide collaborative workspace & announcements"
                    : `${activeRecipient?.title || "Counsel"} • ${activeRecipient?.practice || "Legal Advisory"}`}
                </p>
              </div>
            </div>
          </div>

          {/* MESSAGES LIST */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {activeChatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                <MessageSquare className="w-10 h-10 mb-2 text-yellow-500 opacity-40" />
                <p className="font-extrabold text-white text-xs uppercase tracking-wider">No messages yet in this channel</p>
                <p className="text-[11px] text-gray-400 max-w-xs mt-1">
                  Start collaboration by typing a message, attaching a case matter, or sharing a document resource below.
                </p>
              </div>
            ) : (
              activeChatMessages.map((msg) => {
                const isMe = msg.senderUid === currentUid;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold text-yellow-500 uppercase tracking-wider">{msg.senderName}</span>
                      <span className="text-[9px] text-gray-500 font-mono">{msg.timeFormatted}</span>
                    </div>

                    <div className={`max-w-md rounded-xs p-3.5 text-xs shadow-md ${
                      isMe
                        ? "bg-yellow-500 text-black font-medium"
                        : "bg-neutral-900 border border-white/10 text-white"
                    }`}>
                      {/* LINKED CASE MATTER BADGE */}
                      {msg.matterTitle && (
                        <div className={`mb-2 p-2 rounded-xs border text-[11px] flex items-center gap-2 ${
                          isMe ? "bg-black/20 border-black/30 text-black font-extrabold" : "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                        }`}>
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <div>
                            <span className="font-bold block">Case Matter: {msg.matterTitle}</span>
                          </div>
                        </div>
                      )}

                      {/* RESOURCE ATTACHMENT BADGE */}
                      {msg.resourceTitle && (
                        <div className={`mb-2 p-2 rounded-xs border text-[11px] flex items-center gap-2 ${
                          isMe ? "bg-black/20 border-black/30 text-black font-extrabold" : "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                        }`}>
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-bold">Attached Resource: {msg.resourceTitle}</span>
                        </div>
                      )}

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                      {/* DELETE BUTTON IF MY MESSAGE */}
                      {isMe && (
                        <button
                          onClick={() => deleteDirectMessage(msg.id)}
                          className="mt-1 text-[10px] text-black/60 hover:text-black font-extrabold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ATTACHMENT / LINK CASE OPTIONS BAR */}
          {showAttachMenu && (
            <div className="p-3 bg-black border-t border-white/10 flex flex-col sm:flex-row gap-3 text-xs">
              <div className="flex-1">
                <label className="font-extrabold text-yellow-500 uppercase tracking-widest text-[10px] block mb-1">Link Case / Matter:</label>
                <select
                  value={selectedMatterId}
                  onChange={(e) => setSelectedMatterId(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xs p-1.5 text-xs text-white"
                >
                  <option value="">-- No linked case --</option>
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.client})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="font-extrabold text-yellow-500 uppercase tracking-widest text-[10px] block mb-1">Share Document Resource:</label>
                <select
                  value={selectedDocTitle}
                  onChange={(e) => setSelectedDocTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xs p-1.5 text-xs text-white"
                >
                  <option value="">-- No resource attachment --</option>
                  {docs.map((d) => (
                    <option key={d.id} value={d.title}>
                      {d.title} ({d.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* INPUT FORM */}
          <form onSubmit={handleSendMessage} className="p-3 bg-black border-t border-white/10 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`p-2 rounded-xs border text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                showAttachMenu || selectedMatterId || selectedDocTitle
                  ? "bg-yellow-500 text-black border-yellow-500 font-extrabold"
                  : "bg-neutral-900 border-white/10 text-white hover:border-yellow-500"
              }`}
              title="Attach case or document"
            >
              <Paperclip className="w-4 h-4" />
              <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Attach Resource</span>
            </button>

            <input
              type="text"
              placeholder={`Message ${selectedRecipientUid === "all" ? "all counsel..." : activeRecipient?.name + "..."}`}
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-neutral-900 border border-white/10 rounded-xs text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />

            <button
              type="submit"
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              Send <Send className="w-3.5 h-3.5 text-black" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
