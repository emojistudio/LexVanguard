import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Briefcase, Plus, Calendar, Sparkles, CheckCircle2, AlertCircle, Files,
  ChevronRight, ChevronLeft, Phone, Send, Search, Scale, Check, LogOut,
  User, RefreshCw, Image as ImageIcon, Trash2, MapPin, Clock, X, Mail, Home,
  Shield, Users, UserCheck, UserPlus, DollarSign, Lock, Bell, MessageSquare
} from "lucide-react";
import { 
  collection, query, where, onSnapshot, addDoc, serverTimestamp, 
  doc, updateDoc, deleteDoc, orderBy, limit 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/auth-context";
import { resolveProfileImage } from "../lib/profile-images";
import { handleProfileImageError } from "../lib/profile-store";
import { subscribeFirestoreMembers, updateUserOfficeRole, type FirestoreMember } from "../lib/users";
import { ResearchCoHelper } from "../components/ResearchCoHelper";
import { HostEventModal } from "../components/HostEventModal";
import { EditProfileModal } from "../components/EditProfileModal";
import { InviteModal } from "../components/InviteModal";
import { subscribeEvents, deleteFirmEvent, type FirmEvent } from "../lib/events-store";
import { UserManagementModule } from "../components/UserManagementModule";
import { ChambersInboxModule } from "../components/ChambersInboxModule";
import { EventsAdminModule } from "../components/EventsAdminModule";
import { NewsletterBroadcastModule } from "../components/NewsletterBroadcastModule";

export interface OfficeData {
  id: string;
  name: string;
  code: string;
  managingPartner?: string;
  practiceAreas?: string[];
  status?: string;
  description?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  officeId?: string;
  assigneeName?: string;
  dueDate?: string;
  priority?: "High" | "Medium" | "Low" | string;
  status: "Completed" | "In Progress" | "Pending" | string;
  notes?: string;
}

export interface MatterItem {
  id: string;
  title: string;
  clientName?: string;
  practiceArea?: string;
  status?: string;
  refNo?: string;
  description?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  details?: string;
  timestamp?: any;
  user?: string;
  time?: string;
  officeId?: string;
}

export interface ChatMessageItem {
  id: string;
  senderName: string;
  senderInitials: string;
  text: string;
  time: string;
  isMe?: boolean;
}

function UserManagementModal({ onClose }: { onClose: () => void }) {
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsub = subscribeFirestoreMembers((updated) => setMembers(updated));
    return () => unsub();
  }, []);

  const handleRoleChange = async (targetUid: string, newOfficeId: string) => {
    setUpdatingUid(targetUid);
    setSuccessMsg("");
    const ok = await updateUserOfficeRole(targetUid, newOfficeId);
    setUpdatingUid(null);
    if (ok) {
      setSuccessMsg("Office role updated successfully in Firestore!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-black rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Management & Office Roles</h2>
              <p className="text-xs text-gray-500">Reassign Admin, Finance, or Counsel office status to firm members</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 pr-1">
          {members.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No registered members found in Firestore.</div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
                  <th className="p-3">Member</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Office</th>
                  <th className="p-3">Reassign Office Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m) => {
                  const currentOffice = (m.officeId || "counsel").toLowerCase();
                  return (
                    <tr key={m.uid} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3 font-semibold text-gray-900 flex items-center gap-2">
                        <img 
                          src={resolveProfileImage(m.name, m.profilePhoto || m.image)} 
                          onError={(e) => handleProfileImageError(e, m.name)}
                          className="w-7 h-7 rounded-full object-cover border" 
                        />
                        <div>
                          <div>{m.name}</div>
                          <div className="text-[10px] text-gray-500 font-normal">{m.title || "Counsel"}</div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600 font-mono text-[11px]">{m.email}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          currentOffice === "admin" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                          currentOffice === "finance" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                          currentOffice === "managing_partner" ? "bg-purple-100 text-purple-800 border border-purple-300" :
                          "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                          {currentOffice}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          disabled={updatingUid === m.uid}
                          value={currentOffice}
                          onChange={(e) => handleRoleChange(m.uid, e.target.value)}
                          className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        >
                          <option value="counsel">Counsel Office</option>
                          <option value="admin">Admin Office</option>
                          <option value="finance">Finance Office</option>
                          <option value="managing_partner">Managing Partner</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 pt-3 border-t flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export const OfficePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { firmUser, firebaseUser, logout } = useAuth();

  // Dynamic User Profile Info from Auth
  const currentUserName = firmUser?.name || firebaseUser?.displayName || "Counsel";
  const currentUserTitle = firmUser?.title || firmUser?.role?.name || "Counsel";
  const currentUserPractice = firmUser?.practice || "Commercial Litigation & Legal Advisory";
  const currentUserAvatar = resolveProfileImage(currentUserName);

  const rawOfficeId = (firmUser?.officeId || "counsel").toLowerCase();
  const isAdmin = rawOfficeId === "admin" || rawOfficeId === "managing_partner" || (firmUser?.role?.level ?? 50) <= 10;
  const isFinance = rawOfficeId === "finance";

  // State Management
  const [offices, setOffices] = useState<OfficeData[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [matters, setMatters] = useState<MatterItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [documentCount, setDocumentCount] = useState<number>(128);

  // UI Modals
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewMatterModalOpen, setIsNewMatterModalOpen] = useState(false);
  const [isEventsManagerOpen, setIsEventsManagerOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isChambersInboxOpen, setIsChambersInboxOpen] = useState(false);
  const [isAuditLogsPanelOpen, setIsAuditLogsPanelOpen] = useState(false);
  const [galleryEvent, setGalleryEvent] = useState<FirmEvent | null>(null);

  // Events State
  const [allEvents, setAllEvents] = useState<FirmEvent[]>([]);

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  
  const [newMatterTitle, setNewMatterTitle] = useState("");
  const [newMatterClient, setNewMatterClient] = useState("");
  const [newMatterArea, setNewMatterArea] = useState("Commercial Litigation");

  // Chat State (Wired with Firebase & Real Attorney Contacts)
  const [activeChatContact, setActiveChatContact] = useState<{
    id: string;
    name: string;
    title: string;
    avatar: string;
    initials: string;
  }>({
    id: "chambers_all",
    name: "Chambers General Workspace",
    title: "Firm-wide Communications",
    avatar: "https://ui-avatars.com/api/?name=Chambers+General&background=1d1d1f&color=fff",
    initials: "ALL"
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [rosterMembers, setRosterMembers] = useState<FirestoreMember[]>([]);

  // 1. Listen to Firebase Real-time Firestore Collections & Events Store
  useEffect(() => {
    const unsubEvents = subscribeEvents((evts) => setAllEvents(evts));
    const unsubRoster = subscribeFirestoreMembers((updated) => setRosterMembers(updated));

    // Tasks listener with fallback
    const tasksQuery = query(collection(db, "office_tasks"), limit(25));
    const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
      const list: TaskItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as TaskItem);
      });
      setTasks(list);
    }, () => {
      setTasks([
        { id: "t1", title: "Review Supreme Court Constitutional Petition No. 4", priority: "High", dueDate: "Today", status: "Pending" },
        { id: "t2", title: "Prepare Corporate M&A Due Diligence Report", priority: "Medium", dueDate: "Tomorrow", status: "Pending" }
      ]);
    });

    // Matters listener with fallback
    const mattersQuery = query(collection(db, "matters"), limit(25));
    const unsubMatters = onSnapshot(mattersQuery, (snapshot) => {
      const list: MatterItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as MatterItem);
      });
      setMatters(list);
    }, () => {
      setMatters([
        { id: "m1", title: "Commercial IP Dispute - LexVanguard v. Partner", clientName: "LexVanguard LLP", status: "Active", practiceArea: "Intellectual Property" }
      ]);
    });

    // Audit logs listener with fallback
    const logsQuery = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(10));
    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      const list: AuditLogItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as AuditLogItem);
      });
      setAuditLogs(list);
    }, () => {
      setAuditLogs([
        { id: "l1", action: "Admin Session Authenticated", user: "Prince Micah", timestamp: "Just now" },
        { id: "l2", action: "Chambers Workspace System Active", user: "System Guard", timestamp: "Live" }
      ]);
    });

    // Documents count listener with fallback
    const docsQuery = query(collection(db, "office_documents"));
    const unsubDocs = onSnapshot(docsQuery, (snapshot) => {
      if (snapshot.size > 0) setDocumentCount(snapshot.size);
    }, () => {
      setDocumentCount(142);
    });

    return () => {
      unsubEvents();
      unsubRoster();
      unsubTasks();
      unsubMatters();
      unsubLogs();
      unsubDocs();
    };
  }, []);

  // 2. Listen to Real-time Chat Messages for selected contact / channel
  useEffect(() => {
    const msgQuery = query(
      collection(db, "chambers_messages"),
      where("channelId", "==", activeChatContact.id),
      orderBy("timestamp", "asc"),
      limit(50)
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
      console.warn("Messages listener error:", err);
      setChatMessages([]);
    });

    return () => unsubMsg();
  }, [activeChatContact.id, firebaseUser, currentUserName]);

  // Actions
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      await updateDoc(doc(db, "office_tasks", taskId), { status: newStatus });
    } catch (e) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTaskObj = {
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      dueDate: newTaskDueDate || "Tomorrow",
      status: "Pending",
      assigneeName: currentUserName,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "office_tasks"), newTaskObj);
    } catch (err) {
      setTasks(prev => [{ id: `task_${Date.now()}`, ...newTaskObj, status: "Pending" }, ...prev]);
    }

    setNewTaskTitle("");
    setIsNewTaskModalOpen(false);
  };

  const handleCreateMatter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatterTitle.trim()) return;

    const newMatterObj = {
      title: newMatterTitle.trim(),
      clientName: newMatterClient.trim() || "Apex Holdings",
      practiceArea: newMatterArea,
      status: "Active",
      refNo: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "matters"), newMatterObj);
    } catch (err) {
      setMatters(prev => [{ id: `matter_${Date.now()}`, ...newMatterObj }, ...prev]);
    }

    setNewMatterTitle("");
    setNewMatterClient("");
    setIsNewMatterModalOpen(false);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msgObj = {
      channelId: activeChatContact.id,
      senderUid: firebaseUser?.uid || "guest",
      senderName: currentUserName,
      senderInitials: currentUserName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2),
      text: chatInput.trim(),
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "chambers_messages"), msgObj);
    } catch (err) {
      console.warn("Firestore chat add error:", err);
      // Local optimistic update
      setChatMessages(prev => [
        ...prev,
        {
          id: `local_${Date.now()}`,
          senderName: currentUserName,
          senderInitials: msgObj.senderInitials,
          text: chatInput.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true
        }
      ]);
    }

    setChatInput("");
  };

  // Metrics computation from real dynamic state
  const activeMattersCount = matters.filter(m => m.status !== "Closed").length;
  const pendingTasksCount = tasks.filter(t => t.status !== "Completed").length;
  const highPriorityTasksCount = tasks.filter(t => t.priority === "High" && t.status !== "Completed").length;

  return (
    <div className="min-h-screen relative p-3 sm:p-5 lg:p-8 font-sans selection:bg-[#0071e3] selection:text-white bg-[#f5f5f7] text-[#1d1d1f] overflow-x-hidden">

      {/* Dynamic Background Blur Orbs */}
      <div className="bg-orbs pointer-events-none">
        <div className="orb bg-blue-300/60 w-[300px] md:w-[600px] h-[300px] md:h-[600px] top-[-10%] left-[-10%] animate-blob"></div>
        <div className="orb bg-cyan-200/60 w-[250px] md:w-[500px] h-[250px] md:h-[500px] top-[20%] right-[-10%] animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="orb bg-indigo-200/60 w-[300px] md:w-[550px] h-[300px] md:h-[550px] bottom-[-20%] left-[20%] animate-blob" style={{ animationDelay: "4s" }}></div>
      </div>

      <main className="max-w-[1500px] mx-auto z-10 relative mt-2 md:mt-4 space-y-6">
        
        {/* 1. TOP PROFILE & NAVIGATION HEADER BAR */}
        <div className="glass-card p-5 sm:p-6 lg:p-7 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-5 text-center sm:text-left">
            <div 
              onClick={() => setIsEditProfileOpen(true)}
              title="Edit Profile Photo"
              className="relative group cursor-pointer w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-black shrink-0 transition transform hover:scale-105"
            >
              <img 
                src={currentUserAvatar} 
                alt={currentUserName} 
                className="w-full h-full rounded-full object-cover border-2 border-white bg-zinc-900" 
              />
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider">
                <span>Edit</span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 
                  onClick={() => setIsEditProfileOpen(true)}
                  title="Click to Edit Profile"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] hover:text-black cursor-pointer transition-colors"
                >
                  {currentUserName}
                </h1>
                {isAdmin ? (
                  <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border border-black">
                    <Shield className="w-3 h-3 text-white" /> Admin
                  </span>
                ) : isFinance ? (
                  <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border border-black">
                    <DollarSign className="w-3 h-3 text-white" /> Finance
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border border-black">
                    <Briefcase className="w-3 h-3 text-white" /> Counsel
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-zinc-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-zinc-700 shrink-0" /> {currentUserPractice}
              </p>
            </div>
          </div>

          {/* TOP NAVIGATION CONTROLS (Words only: HOME, EDIT PROFILE, LOG OUT, plus Bell notification icon) */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <button 
              onClick={() => setLocation("/")}
              className="px-4 py-2 border border-zinc-300 hover:border-black text-[#1d1d1f] hover:bg-black hover:text-white font-bold text-xs uppercase tracking-widest transition-all rounded-xl cursor-pointer shadow-xs"
            >
              HOME
            </button>

            <button 
              onClick={() => setIsEditProfileOpen(true)}
              className="px-4 py-2 border border-zinc-300 hover:border-black text-[#1d1d1f] hover:bg-black hover:text-white font-bold text-xs uppercase tracking-widest transition-all rounded-xl cursor-pointer shadow-xs"
            >
              EDIT PROFILE
            </button>

            <button 
              onClick={() => setIsAuditLogsPanelOpen(true)}
              title="System Audit Log Stream"
              className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center rounded-xl cursor-pointer relative shadow-xs"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              {auditLogs.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 absolute top-1.5 right-1.5 animate-ping"></span>
              )}
              {auditLogs.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 absolute top-1.5 right-1.5"></span>
              )}
            </button>

            <button 
              onClick={logout}
              className="px-4 py-2 border border-zinc-300 hover:border-rose-600 text-rose-700 hover:bg-rose-600 hover:text-white font-bold text-xs uppercase tracking-widest transition-all rounded-xl cursor-pointer shadow-xs"
            >
              LOG OUT
            </button>
          </div>
        </div>

        {/* 2. MAIN AREA CONCRETE MOSAIC GRID LAYOUT */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono">Firm Operations & Modules Mosaic</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            
            {/* 1. BIG SQUARE CHAMBERS INBOX ICON TILE (No text, opens WhatsApp Inbox) */}
            <div 
              onClick={() => setIsChambersInboxOpen(true)}
              title="Open Chambers Communications Inbox"
              className="aspect-square bg-[#1d1d1f] hover:bg-black text-white rounded-3xl p-5 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:scale-[1.03] transition-all shadow-md relative overflow-hidden border border-zinc-800"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-amber-300" />
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-4 right-4 animate-pulse"></span>
            </div>

            {/* 2. RESEARCH AI ENGINE TILE */}
            <div 
              onClick={() => setIsResearchModalOpen(true)}
              title="AI Legal Research & eLegal Intelligence Engine"
              className="aspect-square bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:scale-[1.03] hover:border-black transition-all shadow-xs"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-900 leading-tight">AI Research Engine</span>
            </div>

            {/* 3. USER MANAGEMENT TILE (Admin) */}
            {isAdmin && (
              <div 
                onClick={() => setIsUserManagementOpen(true)}
                title="User Roster, Promotions & Admissions Directorate"
                className="aspect-square bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:scale-[1.03] hover:border-black transition-all shadow-xs"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-zinc-900 leading-tight">User Directorate</span>
              </div>
            )}

            {/* 4. EVENTS & GALLERY TILE (Admin) */}
            {isAdmin && (
              <div 
                onClick={() => setIsEventsManagerOpen(true)}
                title="Firm Announcements & Photo Gallery Suite"
                className="aspect-square bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:scale-[1.03] hover:border-black transition-all shadow-xs"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-zinc-900 leading-tight">Events Suite</span>
              </div>
            )}

            {/* 5. GAZETTE NEWSLETTER TILE (Admin) */}
            {isAdmin && (
              <div 
                onClick={() => setIsNewsletterModalOpen(true)}
                title="Gazette Newsletter Broadcast Suite"
                className="aspect-square bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:scale-[1.03] hover:border-black transition-all shadow-xs"
              >
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-zinc-900 leading-tight">Gazette Broadcast</span>
              </div>
            )}

            {/* 6. NEW LEGAL MATTER TILE */}
            <div 
              onClick={() => setIsNewMatterModalOpen(true)}
              title="Register New Legal Matter"
              className="aspect-square bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:scale-[1.03] hover:border-black transition-all shadow-xs"
            >
              <div className="w-11 h-11 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-300 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-bold text-zinc-900 leading-tight">New Matter</span>
            </div>

            {/* 7. INVITE MEMBER TILE (Admin) */}
            {isAdmin && (
              <div 
                onClick={() => setIsInviteModalOpen(true)}
                title="Invite New Counsel or Team Member"
                className="aspect-square bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:scale-[1.03] hover:border-black transition-all shadow-xs"
              >
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-zinc-900 leading-tight">Invite Counsel</span>
              </div>
            )}

          </div>
        </div>

        {/* 3. KEY METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <Briefcase className="w-4 h-4 text-[#1d1d1f]" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-[#1d1d1f] leading-none">{activeMattersCount}</h3>
              <p className="text-[11px] font-semibold text-[#86868b] mt-1">Active Matters</p>
            </div>
          </div>

          <div className="glass-card p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <CheckCircle2 className="w-4 h-4 text-[#1d1d1f]" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-[#1d1d1f] leading-none">{pendingTasksCount}</h3>
              <p className="text-[11px] font-semibold text-[#86868b] mt-1">Pending Tasks</p>
            </div>
          </div>

          <div className="glass-card p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-rose-600 leading-none">{highPriorityTasksCount}</h3>
              <p className="text-[11px] font-semibold text-[#86868b] mt-1">High Priority</p>
            </div>
          </div>

          <div className="glass-card p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <Files className="w-4 h-4 text-[#1d1d1f]" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-[#1d1d1f] leading-none">{documentCount}</h3>
              <p className="text-[11px] font-semibold text-[#86868b] mt-1">Filed Documents</p>
            </div>
          </div>
        </div>

        {/* 4. WORKSPACE & TASK QUEUE ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
          <div className="glass-card col-span-1 md:col-span-2 flex flex-col max-h-[460px]">
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white/30 rounded-t-[24px]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-[#1d1d1f]" />
                </div>
                <h2 className="text-base font-bold text-[#1d1d1f] tracking-tight">Personal Docket</h2>
              </div>
              <button 
                onClick={() => setIsResearchModalOpen(true)}
                className="text-xs font-bold text-[#0071e3] hover:underline cursor-pointer"
              >
                Open Workspace
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {matters.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#86868b] space-y-2">
                  <p className="font-semibold">No active legal matters registered.</p>
                  <button 
                    onClick={() => setIsNewMatterModalOpen(true)} 
                    className="px-3 py-1.5 bg-[#1d1d1f] text-white text-[11px] font-bold rounded-lg hover:bg-black transition cursor-pointer"
                  >
                    + Open First Matter
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {matters.map((m) => (
                    <div 
                      key={m.id} 
                      onClick={() => setIsResearchModalOpen(true)}
                      className="p-3 hover:bg-black/5 rounded-2xl transition-colors group cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold text-xs">
                          {m.practiceArea ? m.practiceArea.substring(0, 2).toUpperCase() : 'LV'}
                        </div>
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors truncate">{m.title}</h4>
                          <p className="text-xs font-medium text-[#86868b] truncate">{m.clientName || m.practiceArea || 'Active Legal Matter'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#86868b] shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Task Queue */}
          <div className="glass-card col-span-1 md:col-span-2 flex flex-col max-h-[460px]">
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white/30 rounded-t-[24px]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#1d1d1f] tracking-tight">Task Queue</h2>
              </div>
              <button 
                onClick={() => setIsNewTaskModalOpen(true)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1d1d1f] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {tasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#86868b] space-y-2">
                  <p className="font-semibold">No pending tasks in queue.</p>
                  <button 
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="px-3 py-1.5 bg-[#1d1d1f] text-white text-[11px] font-bold rounded-lg hover:bg-black transition cursor-pointer"
                  >
                    + Add First Task
                  </button>
                </div>
              ) : (
                tasks.map((t) => {
                  const isDone = t.status === "Completed";
                  return (
                    <label 
                      key={t.id}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-white/60 border border-white hover:bg-white transition-colors cursor-pointer group shadow-xs"
                    >
                      <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                        <input 
                          type="checkbox"
                          checked={isDone}
                          onChange={() => handleToggleTask(t.id, t.status)}
                          className="peer appearance-none w-5 h-5 border-2 border-zinc-300 rounded-full checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                        />
                        <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none stroke-[3]" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className={`text-sm font-bold transition-colors leading-tight truncate ${isDone ? 'line-through text-zinc-400' : 'text-[#1d1d1f] group-hover:text-blue-600'}`}>
                          {t.title}
                        </h4>
                        <p className="text-xs text-[#86868b] mt-0.5 truncate">{t.notes || t.assigneeName || 'Legal task'}</p>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border ${
                          t.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}>
                          {t.dueDate || 'Pending'}
                        </span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Audit Log Stream */}
          <div className="glass-card col-span-1 md:col-span-2 flex flex-col max-h-[460px]">
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white/30 rounded-t-[24px]">
              <div>
                <h2 className="text-base font-bold text-[#1d1d1f] tracking-tight">Audit Log Stream</h2>
                <p className="text-[10px] text-zinc-500 font-medium">Real-Time Event Stream</p>
              </div>
              <button
                onClick={() => setIsAuditLogsPanelOpen(true)}
                className="px-3 py-1.5 bg-[#1d1d1f] text-white rounded-xl text-xs font-bold hover:bg-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Bell className="w-3.5 h-3.5 text-amber-300" /> Stream Panel ({auditLogs.length})
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto relative">
              {auditLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#86868b]">
                  <p className="font-semibold">No audit logs recorded yet.</p>
                  <p className="text-[11px] text-zinc-400 mt-1">System activity and user actions will log here dynamically in real time.</p>
                </div>
              ) : (
                <>
                  <div className="absolute left-6 top-6 bottom-6 w-[1.5px] bg-zinc-200"></div>
                  <div className="space-y-5 relative">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="flex gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center shrink-0 relative z-10 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-[#1d1d1f] leading-tight truncate">{log.action}</h4>
                          <p className="text-xs text-[#86868b] mt-0.5 truncate">{log.details || 'System activity logged'}</p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-1">{log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : (log.timestamp || 'Just now')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* RESEARCH AI FULL PAGE MODAL */}
      {isResearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#fafafa] flex flex-col w-screen h-screen">
          <ResearchCoHelper onClose={() => setIsResearchModalOpen(false)} />
        </div>
      )}

      {/* NEW TASK MODAL */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 space-y-4 bg-white/95">
            <h3 className="text-base font-bold text-[#1d1d1f]">Add New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#86868b] uppercase mb-1">Task Description</label>
                <input 
                  type="text"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. File Constitutional Petition"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#86868b] uppercase mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#86868b] uppercase mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={e => setNewTaskDueDate(e.target.value)}
                    placeholder="Tomorrow"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsNewTaskModalOpen(false)} className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1d1d1f] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-black shadow-sm cursor-pointer">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW MATTER MODAL */}
      {isNewMatterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 space-y-4 bg-white/95">
            <h3 className="text-base font-bold text-[#1d1d1f]">Open New Legal Matter</h3>
            <form onSubmit={handleCreateMatter} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#86868b] uppercase mb-1">Matter Title</label>
                <input 
                  type="text"
                  value={newMatterTitle}
                  onChange={e => setNewMatterTitle(e.target.value)}
                  placeholder="e.g. Kariuki v. National Land Commission"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#86868b] uppercase mb-1">Client Name</label>
                <input 
                  type="text"
                  value={newMatterClient}
                  onChange={e => setNewMatterClient(e.target.value)}
                  placeholder="e.g. Apex Holdings Ltd"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#86868b] uppercase mb-1">Practice Area</label>
                <select
                  value={newMatterArea}
                  onChange={e => setNewMatterArea(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="Commercial Litigation">Commercial Litigation</option>
                  <option value="Constitutional Law">Constitutional Law</option>
                  <option value="Appellate">Appellate</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Land & Property">Land & Property</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsNewMatterModalOpen(false)} className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1d1d1f] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-black shadow-sm cursor-pointer">Open Matter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVENTS & ANNOUNCEMENTS DIRECTORATE MODULE */}
      {isEventsManagerOpen && (
        <EventsAdminModule
          onClose={() => setIsEventsManagerOpen(false)}
        />
      )}

      {/* GAZETTE NEWSLETTER BROADCAST DIRECTORATE MODULE */}
      {isNewsletterModalOpen && (
        <NewsletterBroadcastModule
          onClose={() => setIsNewsletterModalOpen(false)}
        />
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <EditProfileModal
          onClose={() => setIsEditProfileOpen(false)}
          onSaved={() => {
            setIsEditProfileOpen(false);
          }}
        />
      )}

      {/* INVITE MEMBER MODAL */}
      {isInviteModalOpen && (
        <InviteModal
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}

      {/* USER MANAGEMENT MODULE */}
      {isUserManagementOpen && (
        <UserManagementModule
          onClose={() => setIsUserManagementOpen(false)}
        />
      )}

      {/* CHAMBERS COMMUNICATIONS FULL-SCREEN WHATSAPP INBOX */}
      {isChambersInboxOpen && (
        <ChambersInboxModule
          onClose={() => setIsChambersInboxOpen(false)}
        />
      )}

      {/* AUDIT LOG STREAM NOTIFICATION PANEL */}
      {isAuditLogsPanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-end p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 bg-[#1d1d1f] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight">System Audit Log Stream</h2>
                  <p className="text-[10px] text-zinc-400">Real-time Firm Activity & Events Notification Center</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditLogsPanelOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50">
              {auditLogs.length === 0 ? (
                <div className="py-20 text-center text-xs text-zinc-500 space-y-2">
                  <Bell className="w-10 h-10 text-zinc-300 mx-auto" />
                  <p className="font-bold">No Audit Log Activity Recorded</p>
                  <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">Actions performed across the office platform will register here dynamically.</p>
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">{log.action}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{log.time}</span>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">{log.details}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                      <span>Actor: {log.user || 'System'}</span>
                      <span className="uppercase text-amber-600 font-bold">{log.officeId || 'firm'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OfficePage;
