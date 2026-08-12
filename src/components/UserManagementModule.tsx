import React, { useState, useEffect } from "react";
import { 
  Users, UserCheck, UserPlus, FileText, CheckCircle2, XCircle, PauseCircle, 
  Trash2, Shield, Briefcase, Mail, RefreshCw, X, Check, ArrowUpRight, ArrowDownRight, Search
} from "lucide-react";
import { 
  collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy, serverTimestamp, setDoc 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { subscribeFirestoreMembers, updateUserOfficeRole, type FirestoreMember } from "../lib/users";
import { resolveProfileImage } from "../lib/profile-images";
import { handleProfileImageError } from "../lib/profile-store";

interface UserManagementModuleProps {
  onClose: () => void;
}

export interface ApplicationItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cvFileName?: string;
  cvUrl?: string;
  roleInterest?: string;
  statement?: string;
  status: "pending" | "accepted" | "rejected" | string;
  createdAt?: any;
}

export const UserManagementModule: React.FC<UserManagementModuleProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"members" | "applications" | "invite">("members");
  
  // State
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [processingAppId, setProcessingAppId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("Counsel");
  const [sendingInvite, setSendingInvite] = useState(false);

  // 1. Subscribe to Members
  useEffect(() => {
    const unsub = subscribeFirestoreMembers((updated) => setMembers(updated));
    return () => unsub();
  }, []);

  // 2. Subscribe to Pending Applications
  useEffect(() => {
    const appsQuery = query(collection(db, "firm_applications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(appsQuery, (snapshot) => {
      const list: ApplicationItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ApplicationItem);
      });
      setApplications(list);
    }, (err) => {
      console.warn("Applications listener fallback:", err);
    });
    return () => unsub();
  }, []);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Action: Promote / Demote / Reassign Member
  const handleRoleChange = async (targetUid: string, targetName: string, targetEmail: string, currentOffice: string, newOffice: string) => {
    setUpdatingUid(targetUid);
    const ok = await updateUserOfficeRole(targetUid, newOffice);
    setUpdatingUid(null);

    if (ok) {
      showFeedback(`Updated designation for ${targetName} to ${newOffice.toUpperCase()}.`);
    } else {
      showFeedback("Failed to update role in Firestore.", "error");
    }
  };

  // Action: Pause Member (Suspend)
  const handleTogglePause = async (targetUid: string, currentStatus?: string) => {
    setUpdatingUid(targetUid);
    const newStatus = currentStatus === "paused" ? "active" : "paused";
    try {
      await updateDoc(doc(db, "users", targetUid), { status: newStatus });
      showFeedback(`Member status set to ${newStatus.toUpperCase()}`);
    } catch (e) {
      showFeedback("Failed to update member status.", "error");
    } finally {
      setUpdatingUid(null);
    }
  };

  // Action: Dismiss Member
  const handleDismissMember = async (targetUid: string, name: string) => {
    if (!confirm(`Are you sure you want to dismiss member "${name}" from LexVanguard Advocates LLP?`)) return;

    setUpdatingUid(targetUid);
    try {
      await updateDoc(doc(db, "users", targetUid), { status: "dismissed" });
      showFeedback(`Member ${name} has been dismissed.`);
    } catch (e) {
      showFeedback("Error dismissing member.", "error");
    } finally {
      setUpdatingUid(null);
    }
  };

  // Action: Accept Applicant
  const handleAcceptApplicant = async (app: ApplicationItem) => {
    setProcessingAppId(app.id);
    try {
      // 1. Send acceptance email
      await fetch("/api/process-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept",
          name: app.name,
          email: app.email,
          roleInterest: app.roleInterest || "Counsel"
        })
      });

      // 2. Update application status in Firestore
      await updateDoc(doc(db, "firm_applications", app.id), { status: "accepted" });

      // 3. Save invitation record so registration is authorized seamlessly
      const cleanEmail = app.email.toLowerCase().trim();
      const token = `inv_app_${app.id}`;
      const invitation = {
        id: token,
        email: cleanEmail,
        name: app.name || "Counsel",
        invitedBy: "Executive Admissions Committee",
        invitedByEmail: "info@lexvanguard.xyz",
        officeId: "counsel",
        roleName: app.roleInterest || "Counsel",
        roleLevel: 50,
        token,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      try {
        const emailKey = cleanEmail.replace(/[^a-z0-9]/g, "_");
        await setDoc(doc(db, "invitations", token), invitation);
        await setDoc(doc(db, "invitations_by_email", emailKey), invitation);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(`lex_invitation_${token}`, JSON.stringify(invitation));
          localStorage.setItem(`lex_invitation_email_${cleanEmail}`, JSON.stringify(invitation));
        }
      } catch (e) {}

      showFeedback(`Accepted ${app.name}! Formal acceptance notice dispatched to ${app.email}.`);
    } catch (err) {
      showFeedback("Error accepting application.", "error");
    } finally {
      setProcessingAppId(null);
    }
  };

  // Action: Reject Applicant
  const handleRejectApplicant = async (app: ApplicationItem) => {
    if (!confirm(`Reject membership application for ${app.name}?`)) return;

    setProcessingAppId(app.id);
    try {
      // 1. Send courteous rejection email
      await fetch("/api/process-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          name: app.name,
          email: app.email,
          roleInterest: app.roleInterest || "Counsel"
        })
      });

      // 2. Update application status in Firestore
      await updateDoc(doc(db, "firm_applications", app.id), { status: "rejected" });

      showFeedback(`Declined application for ${app.name}. Polite notice sent.`);
    } catch (err) {
      showFeedback("Error declining application.", "error");
    } finally {
      setProcessingAppId(null);
    }
  };

  // Action: Send Invite
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) return;

    setSendingInvite(true);
    try {
      const res = await fetch("/api/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || "Counsel",
          role: inviteRole,
          invitedBy: "Executive Directorate"
        })
      });

      const data = await res.json();
      if (data.success) {
        showFeedback(`Invitation sent successfully to ${inviteEmail}!`);
        setInviteEmail("");
        setInviteName("");
      } else {
        showFeedback(data.error || "Failed to dispatch invitation.", "error");
      }
    } catch (err) {
      showFeedback("Error sending invite.", "error");
    } finally {
      setSendingInvite(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingApps = applications.filter(a => a.status === "pending");

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f7] text-[#1d1d1f] flex flex-col w-screen h-screen overflow-hidden font-sans">
      
      {/* Top Navigation Header */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Executive User Management & Admissions</h1>
            <p className="text-xs text-gray-500">Firm member directory, role promotions, suspension, and join application approvals</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "members" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserCheck className="w-4 h-4 text-gray-700" /> Members Directory ({members.length})
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all relative cursor-pointer ${
              activeTab === "applications" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4 text-gray-700" /> Pending Applications
            {pendingApps.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingApps.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("invite")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "invite" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserPlus className="w-4 h-4 text-gray-700" /> Invite Counsel
          </button>
        </div>

        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div className={`mx-6 mt-4 p-4 rounded-xl border text-xs font-bold flex items-center justify-between ${
          feedbackMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Main Container Content */}
      <main className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full">
        
        {/* TAB 1: MEMBERS DIRECTORY */}
        {activeTab === "members" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search member name or email..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="text-xs font-bold text-gray-500">
                Active Roster: <span className="text-gray-900 font-mono">{members.length}</span> Members
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
                    <th className="p-4">Member Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Current Office Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions & Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMembers.map((m) => {
                    const currentOffice = (m.officeId || "counsel").toLowerCase();
                    const isPaused = m.status === "paused";
                    const isDismissed = m.status === "dismissed";

                    return (
                      <tr key={m.uid} className={`hover:bg-gray-50/80 transition-colors ${isDismissed ? "opacity-50 bg-gray-50" : ""}`}>
                        <td className="p-4 font-semibold text-gray-900 flex items-center gap-3">
                          <img 
                            src={resolveProfileImage(m.name, m.profilePhoto || m.image)} 
                            onError={(e) => handleProfileImageError(e, m.name)}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200" 
                          />
                          <div>
                            <div className="font-bold text-gray-900">{m.name}</div>
                            <div className="text-[10px] text-gray-500 font-normal">{m.title || "Counsel"}</div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 font-mono text-[11px]">{m.email}</td>
                        <td className="p-4">
                          <select
                            disabled={updatingUid === m.uid || isDismissed}
                            value={currentOffice}
                            onChange={(e) => handleRoleChange(m.uid, m.name, m.email, currentOffice, e.target.value)}
                            className="bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                          >
                            <option value="counsel">Counsel Office</option>
                            <option value="admin">Admin Office</option>
                            <option value="finance">Finance Office</option>
                            <option value="managing_partner">Managing Partner</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isDismissed ? "bg-rose-100 text-rose-800" :
                            isPaused ? "bg-amber-100 text-amber-800" :
                            "bg-emerald-100 text-emerald-800"
                          }`}>
                            {isDismissed ? "Dismissed" : isPaused ? "Paused" : "Active"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Pause / Resume Button */}
                            <button
                              disabled={updatingUid === m.uid || isDismissed}
                              onClick={() => handleTogglePause(m.uid, m.status)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                isPaused ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                              }`}
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                              {isPaused ? "Resume" : "Pause"}
                            </button>

                            {/* Dismiss Button */}
                            {!isDismissed && (
                              <button
                                disabled={updatingUid === m.uid}
                                onClick={() => handleDismissMember(m.uid, m.name)}
                                className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Dismiss
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PENDING APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900">Membership Applications ({applications.length})</h2>
              <span className="text-xs font-semibold text-gray-500">Admitted candidates receive immediate email notification dispatches.</span>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-2">
                <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">No Applications Pending</h3>
                <p className="text-xs text-gray-500">Applications submitted via the Homepage "Ask to Join" popup will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications.map((app) => {
                  const isPending = app.status === "pending";
                  const isAccepted = app.status === "accepted";
                  const isRejected = app.status === "rejected";

                  return (
                    <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-bold text-gray-900">{app.name}</h3>
                            <p className="text-xs font-mono text-gray-500">{app.email} {app.phone ? `• ${app.phone}` : ""}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAccepted ? "bg-emerald-100 text-emerald-800" :
                            isRejected ? "bg-rose-100 text-rose-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        <div className="text-xs text-gray-700 bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                          <div className="font-bold text-gray-900">Desired Role: {app.roleInterest || "Counsel"}</div>
                          {app.statement && (
                            <p className="italic text-gray-600 line-clamp-3">"{app.statement}"</p>
                          )}

                          {/* Candidate CV Download / Review Button */}
                          <div className="pt-1">
                            {app.cvUrl ? (
                              <a
                                href={app.cvUrl}
                                download={app.cvFileName || `${app.name.replace(/\s+/g, '_')}_CV.pdf`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer w-full justify-center"
                              >
                                <FileText className="w-4 h-4 text-[#ffc107]" />
                                Download / Review Candidate CV ({app.cvFileName || "CV.pdf"})
                              </a>
                            ) : (
                              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200 text-xs text-gray-700">
                                <span className="font-semibold flex items-center gap-1.5">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  Attached Document:
                                </span>
                                <span className="font-mono text-gray-600 truncate max-w-[180px]">{app.cvFileName || "Resume_Attached.pdf"}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {isPending && (
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                          <button
                            disabled={processingAppId === app.id}
                            onClick={() => handleRejectApplicant(app)}
                            className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" /> Decline & Send Email
                          </button>

                          <button
                            disabled={processingAppId === app.id}
                            onClick={() => handleAcceptApplicant(app)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Admit & Dispatch Offer
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVITE COUNSEL */}
        {activeTab === "invite" && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">Issue Direct Appointment Invitation</h2>
              <p className="text-xs text-gray-500 mt-1">Sends a formal, firm-branded email invitation token with full activation rights.</p>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Invitee Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="counsel.name@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Invitee Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Counsel Kelvin Musya"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Counsel">Counsel</option>
                  <option value="Senior Counsel">Senior Counsel</option>
                  <option value="Managing Partner">Managing Partner</option>
                  <option value="Admin">Admin Directorate</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={sendingInvite}
                  className="w-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition shadow-md"
                >
                  {sendingInvite ? "Dispatching Invitation..." : "Send Formal Invitation Email"}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

    </div>
  );
};
