import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Briefcase, Plus, Calendar, Sparkles, CheckCircle2, AlertCircle, Files,
  ChevronRight, ChevronLeft, Phone, Send, Search, Scale, Check, LogOut,
  User, RefreshCw, Image as ImageIcon, Trash2, MapPin, Clock, X, Mail, Home,
  Shield, Users, UserCheck, UserPlus, DollarSign, Lock
} from "lucide-react";
import { 
  collection, query, where, onSnapshot, addDoc, serverTimestamp, 
  doc, updateDoc, deleteDoc, orderBy, limit 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/auth-context";
import { resolveProfileImage } from "../lib/profile-images";
import { subscribeFirestoreMembers, updateUserOfficeRole, type FirestoreMember } from "../lib/users";
import { ResearchCoHelper } from "../components/ResearchCoHelper";
import { HostEventModal } from "../components/HostEventModal";
import { EventGalleryModal } from "../components/EventGalleryModal";
import { NewsletterAdminModal } from "../components/NewsletterAdminModal";
import { EditProfileModal } from "../components/EditProfileModal";
import { InviteModal } from "../components/InviteModal";
import { subscribeEvents, deleteFirmEvent, type FirmEvent } from "../lib/events-store";

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
                        <img src={m.profilePhoto || m.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} className="w-7 h-7 rounded-full object-cover border" />
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
        { id: "t1", title: "Review Supreme Court Constitutional Petition No. 4", priority: "High", dueDate: "Today", completed: false },
        { id: "t2", title: "Prepare Corporate M&A Due Diligence Report", priority: "Medium", dueDate: "Tomorrow", completed: false }
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
        { id: "m1", title: "Commercial IP Dispute - LexVanguard v. Partner", client: "LexVanguard LLP", status: "Active", area: "Intellectual Property" }
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

      <main className="max-w-[1500px] mx-auto z-10 relative mt-2 md:mt-4">
        
        {/* TOP BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">

          {/* 1. Profile & Controls Bar (Monochrome & Icon-Only) */}
          <div className="glass-card col-span-1 md:col-span-3 p-5 sm:p-6 lg:p-7 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-sm">
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

            {/* HORIZONTAL ICON-ONLY ACTION BAR (Monochrome, No Backgrounds, No Wordings) */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button 
                onClick={() => setLocation("/")}
                title="Home"
                className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer"
              >
                <Home className="w-5 h-5 stroke-[2]" />
              </button>

              {isAdmin && (
                <>
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    title="Invite Team Member"
                    className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5 stroke-[2]" />
                  </button>
                  <button 
                    onClick={() => setIsUserManagementOpen(true)}
                    title="Manage Roles & Offices"
                    className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer"
                  >
                    <UserCheck className="w-5 h-5 stroke-[2]" />
                  </button>
                  <button 
                    onClick={() => setIsNewsletterModalOpen(true)}
                    title="Gazette Newsletter"
                    className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer"
                  >
                    <Mail className="w-5 h-5 stroke-[2]" />
                  </button>
                  <button 
                    onClick={() => setIsEventsManagerOpen(true)}
                    title="Events & Photo Gallery"
                    className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer"
                  >
                    <Calendar className="w-5 h-5 stroke-[2]" />
                  </button>
                </>
              )}

              <button 
                onClick={() => setIsNewMatterModalOpen(true)}
                title="New Matter"
                className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button 
                onClick={() => setIsEditProfileOpen(true)}
                title="Edit Profile"
                className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer"
              >
                <User className="w-5 h-5 stroke-[2]" />
              </button>

              <button 
                onClick={logout}
                title="Sign Out"
                className="w-10 h-10 border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer"
              >
                <LogOut className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* 2. Research AI Card (Compact & High Impact) */}
          <div 
            onClick={() => setIsResearchModalOpen(true)}
            className="glass-card-dark col-span-1 p-5 lg:p-6 flex items-center justify-between md:flex-col md:justify-center md:text-center gap-3 group cursor-pointer hover:scale-[1.02] transition-transform shadow-lg relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">AI Research Engine</h2>
              <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded-full bg-white/10 inline-block mt-1">
                eLegal Intelligence
              </span>
            </div>
          </div>

          {/* 3-6. Key Metrics Row */}
          <div className="glass-card col-span-1 p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <Briefcase className="w-5 h-5 text-[#1d1d1f]" />
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-[#1d1d1f] leading-none">{activeMattersCount}</h3>
              <p className="text-xs font-semibold text-[#86868b] mt-1">Active Matters</p>
            </div>
          </div>

          <div className="glass-card col-span-1 p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <CheckCircle2 className="w-5 h-5 text-[#1d1d1f]" />
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-[#1d1d1f] leading-none">{pendingTasksCount}</h3>
              <p className="text-xs font-semibold text-[#86868b] mt-1">Pending Tasks</p>
            </div>
          </div>

          <div className="glass-card col-span-1 p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-rose-600 leading-none">{highPriorityTasksCount}</h3>
              <p className="text-xs font-semibold text-[#86868b] mt-1">High Priority</p>
            </div>
          </div>

          <div className="glass-card col-span-1 p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <Files className="w-5 h-5 text-[#1d1d1f]" />
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-[#1d1d1f] leading-none">{documentCount}</h3>
              <p className="text-xs font-semibold text-[#86868b] mt-1">Filed Documents</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 mt-4">
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

          {/* 8. Task Queue */}
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

          {/* 9. Real-Time Chambers Chat (Connected to Firebase & Attorney Roster) */}
          <div className="glass-card col-span-1 md:col-span-2 flex flex-col overflow-hidden max-h-[460px] relative">
            
            {/* Contacts Roster */}
            <div className={`flex flex-col w-full h-full bg-white/30 transition-opacity duration-300 ${isChatOpen ? 'opacity-0 pointer-events-none' : ''}`}>
              <div className="p-4 border-b border-black/5 bg-white/50">
                <h2 className="text-base font-bold text-[#1d1d1f] tracking-tight mb-2">Chambers Communications</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search firm members..." 
                    className="w-full bg-white/80 border border-white rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {/* General Channel */}
                <div 
                  onClick={() => {
                    setActiveChatContact({
                      id: "chambers_all",
                      name: "Chambers General Workspace",
                      title: "Firm-wide Communications",
                      avatar: "https://ui-avatars.com/api/?name=Chambers+General&background=1d1d1f&color=fff",
                      initials: "ALL"
                    });
                    setIsChatOpen(true);
                  }}
                  className="flex items-center gap-3 p-3 bg-white shadow-xs border border-white rounded-2xl cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold shrink-0">ALL</div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-xs font-bold text-[#1d1d1f] truncate">Chambers General</h4>
                      <span className="text-[10px] font-bold text-blue-600">Active</span>
                    </div>
                    <p className="text-xs text-[#86868b] truncate">Firm-wide counsel communication channel</p>
                  </div>
                </div>

                {/* Team Roster */}
                {rosterMembers.map((attorney) => (
                  <div 
                    key={attorney.uid}
                    onClick={() => {
                      setActiveChatContact({
                        id: attorney.uid,
                        name: attorney.name,
                        title: attorney.title || "Counsel",
                        avatar: attorney.profilePhoto || attorney.image || resolveProfileImage(attorney.name),
                        initials: attorney.name.split(" ").map(n => n[0]).join("")
                      });
                      setIsChatOpen(true);
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-black/5 rounded-2xl cursor-pointer transition-colors"
                  >
                    <img src={attorney.profilePhoto || resolveProfileImage(attorney.name)} className="w-9 h-9 rounded-full object-cover border border-black/10 shrink-0" />
                    <div className="overflow-hidden flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="text-xs font-bold text-[#1d1d1f] truncate">{attorney.name}</h4>
                        <span className="text-[10px] font-medium text-[#86868b]">Direct</span>
                      </div>
                      <p className="text-xs text-[#86868b] truncate">{attorney.title || 'Counsel'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Conversation View */}
            {isChatOpen && (
              <div className="flex flex-col w-full h-full absolute inset-0 bg-[#f5f5f7]/95 backdrop-blur-2xl z-10 animate-fade-in">
                <div className="p-3 border-b border-black/5 flex items-center gap-3 bg-white/70 shrink-0">
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center text-[#1d1d1f] cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 font-bold" />
                  </button>
                  <img src={activeChatContact.avatar} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="overflow-hidden flex-1">
                    <h3 className="text-xs font-bold text-[#1d1d1f] truncate">{activeChatContact.name}</h3>
                    <p className="text-[10px] font-medium text-[#86868b] truncate">{activeChatContact.title}</p>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : ''}`}>
                      {!msg.isMe && (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {msg.senderInitials}
                        </div>
                      )}
                      <div className="max-w-[85%]">
                        {!msg.isMe && (
                          <span className="text-[10px] font-bold text-[#1d1d1f] block mb-0.5 pl-1">{msg.senderName}</span>
                        )}
                        <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                          msg.isMe ? 'bg-[#0071e3] text-white rounded-br-none shadow-xs' : 'bg-white text-[#1d1d1f] border border-black/5 rounded-bl-none shadow-xs'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChatMessage} className="p-3 border-t border-black/5 bg-white/70 shrink-0">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white border border-zinc-200 rounded-full py-2 px-4 text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="w-8 h-8 bg-[#0071e3] text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-xs shrink-0 cursor-pointer">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* 10. Activity Stream */}
          <div className="glass-card col-span-1 md:col-span-2 flex flex-col max-h-[460px]">
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white/30 rounded-t-[24px]">
              <h2 className="text-base font-bold text-[#1d1d1f] tracking-tight">Audit Log & Stream</h2>
              <span className="text-xs font-bold text-blue-600">Live</span>
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

      {/* EVENTS MANAGEMENT MODAL */}
      {isEventsManagerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0A0A0A] p-5 text-white flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold tracking-wide uppercase font-mono">Events & Symposia Control Panel</h3>
                  <p className="text-xs text-zinc-400">Create upcoming events or update past event gallery photos</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsHostModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Host New Event
                </button>
                <button onClick={() => setIsEventsManagerOpen(false)} className="text-zinc-400 hover:text-white p-1 cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-zinc-50">
              {allEvents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200 p-8 space-y-3">
                  <Calendar className="w-12 h-12 text-zinc-300 mx-auto" />
                  <h4 className="text-sm font-bold text-zinc-800">No firm events registered</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">Create your first LexVanguard symposium, keynote, or workshop.</p>
                  <button
                    onClick={() => setIsHostModalOpen(true)}
                    className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition cursor-pointer"
                  >
                    + Create First Event
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allEvents.map((evt) => {
                    const isPast = evt.status === "Past Event";
                    return (
                      <div key={evt.id} className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs hover:border-amber-500/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              isPast ? "bg-zinc-200 text-zinc-700" : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {evt.status || "Upcoming"}
                            </span>
                            <span className="text-xs font-mono text-zinc-500">{evt.category}</span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-900 leading-snug line-clamp-1">{evt.title}</h4>
                          <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-500" /> {evt.displayDate} ({evt.time})
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {evt.location}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setGalleryEvent(evt)}
                            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            {isPast ? "Manage Gallery Photos" : "Preview Banner"}
                          </button>

                          <button
                            onClick={async () => {
                              if (confirm(`Delete event "${evt.title}"?`)) {
                                await deleteFirmEvent(evt.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setIsEventsManagerOpen(false)}
                className="px-5 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOST NEW EVENT MODAL */}
      {isHostModalOpen && (
        <HostEventModal
          onClose={() => setIsHostModalOpen(false)}
          onCreated={() => setIsHostModalOpen(false)}
        />
      )}

      {/* EVENT GALLERY & PHOTO UPLOAD MODAL */}
      {galleryEvent && (
        <EventGalleryModal
          event={galleryEvent}
          onClose={() => setGalleryEvent(null)}
        />
      )}

      {/* GAZETTE NEWSLETTER ADMIN MODAL */}
      {isNewsletterModalOpen && (
        <NewsletterAdminModal
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

      {/* USER MANAGEMENT MODAL */}
      {isUserManagementOpen && (
        <UserManagementModal
          onClose={() => setIsUserManagementOpen(false)}
        />
      )}

    </div>
  );
};

export default OfficePage;
