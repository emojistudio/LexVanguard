import React, { useState, useEffect } from "react";
import { subscribeFirestoreMembers, FirestoreMember, getMemberRank } from "@/lib/users";
import { subscribeLogs, ActivityLog, addLog } from "@/lib/office-store";
import { 
  ShieldCheck, Users, UserPlus, Key, Building, Megaphone, Calendar, 
  Search, CheckCircle2, ShieldAlert, Edit3, UserCheck, Trash2, ArrowUpRight, 
  ArrowDownRight, Send, Plus, X, Sparkles, AlertCircle
} from "lucide-react";
import { InviteModal } from "@/components/InviteModal";
import { HostEventModal } from "@/components/HostEventModal";

export const ChambersAdminSuite: React.FC = () => {
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchMember, setSearchMember] = useState("");
  
  // Modals state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FirestoreMember | null>(null);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastUrgency, setBroadcastUrgency] = useState<"Normal" | "Urgent">("Normal");
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editPractice, setEditPractice] = useState("");
  const [editOffice, setEditOffice] = useState("");

  useEffect(() => {
    const unsubMembers = subscribeFirestoreMembers((list) => setMembers(list));
    const unsubLogs = subscribeLogs((list) => setLogs(list));
    return () => {
      unsubMembers();
      unsubLogs();
    };
  }, []);

  const handleOpenEdit = (m: FirestoreMember) => {
    setEditingMember(m);
    setEditTitle(m.title || "Counsel");
    setEditPractice(m.practice || "Legal Counsel");
    setEditOffice(m.officeId || "counsel");
  };

  const handleSaveMemberEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.uid === editingMember.uid
          ? {
              ...m,
              title: editTitle,
              practice: editPractice,
              officeId: editOffice
            }
          : m
      )
    );

    addLog({
      officeId: "admin",
      iconType: "user",
      title: `Member Permissions Updated: ${editingMember.name}`,
      details: `Title set to "${editTitle}", Office assigned: /${editOffice}`,
      actorName: "Managing Admin",
      time: "Just now"
    });

    setEditingMember(null);
  };

  const handlePromoteMember = (m: FirestoreMember) => {
    const nextTitle = m.title?.includes("Senior") 
      ? "Partner & Chair" 
      : m.title?.includes("Partner") 
      ? "Managing Partner" 
      : "Senior Associate Counsel";

    setMembers((prev) =>
      prev.map((item) =>
        item.uid === m.uid ? { ...item, title: nextTitle } : item
      )
    );

    addLog({
      officeId: "admin",
      iconType: "user",
      title: `Promoted Staff Member: ${m.name}`,
      details: `New Title: ${nextTitle}`,
      actorName: "Managing Admin",
      time: "Just now"
    });
  };

  const handleDemoteMember = (m: FirestoreMember) => {
    const nextTitle = "Junior Associate Counsel";

    setMembers((prev) =>
      prev.map((item) =>
        item.uid === m.uid ? { ...item, title: nextTitle } : item
      )
    );

    addLog({
      officeId: "admin",
      iconType: "user",
      title: `Role Adjusted: ${m.name}`,
      details: `Title updated to ${nextTitle}`,
      actorName: "Managing Admin",
      time: "Just now"
    });
  };

  const handleRemoveMember = (m: FirestoreMember) => {
    if (!confirm(`Are you sure you want to revoke membership and remove ${m.name} from LexVanguard Chambers?`)) {
      return;
    }

    setMembers((prev) => prev.filter((item) => item.uid !== m.uid));

    addLog({
      officeId: "admin",
      iconType: "alert",
      title: `Member Access Revoked: ${m.name}`,
      details: `Removed from firm membership roster by Managing Admin.`,
      actorName: "Managing Admin",
      time: "Just now"
    });
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;

    setIsSendingBroadcast(true);

    await addLog({
      officeId: "admin",
      iconType: broadcastUrgency === "Urgent" ? "alert" : "bell",
      title: `[BROADCAST] ${broadcastTitle.trim()}`,
      details: broadcastBody.trim(),
      actorName: "Managing Admin",
      time: "Just now"
    });

    setIsSendingBroadcast(false);
    setShowBroadcastModal(false);
    setBroadcastTitle("");
    setBroadcastBody("");
    alert("Firmwide Broadcast Announcement dispatched successfully to all members!");
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
    (m.title && m.title.toLowerCase().includes(searchMember.toLowerCase())) ||
    (m.email && m.email.toLowerCase().includes(searchMember.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-black">
      
      {/* APPLE DESIGN ADMIN HEADER & METRICS */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Tier 1 — Executive Admin Suite
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Chambers Governance & Administrative Control
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Authorize new members, publish official events, broadcast firmwide directives, and regulate partner permissions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-black" /> Invite Member
          </button>

          <button
            onClick={() => setShowEventModal(true)}
            className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-400" /> Create Event
          </button>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-amber-400" /> Broadcast
          </button>
        </div>
      </div>

      {/* GOVERNANCE SUMMARY COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider block">Active Roster</span>
            <span className="text-lg font-bold text-black">{members.length} Members</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-black flex items-center justify-center font-bold shrink-0 border border-neutral-200">
            <Building className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider block">Chambers Offices</span>
            <span className="text-lg font-bold text-black">6 Allocated</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-black flex items-center justify-center font-bold shrink-0 border border-neutral-200">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider block">Security Rank</span>
            <span className="text-lg font-bold text-black">Executive Admin</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-black flex items-center justify-center font-bold shrink-0 border border-neutral-200">
            <Key className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider block">Audit Events</span>
            <span className="text-lg font-bold text-black">{logs.length} Recorded</span>
          </div>
        </div>
      </div>

      {/* MEMBER & AUTHORIZATION MANAGEMENT */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pb-4 border-b border-neutral-200">
          <div>
            <h3 className="font-mono font-bold text-black uppercase tracking-tight text-base flex items-center gap-2">
              <Key className="w-4 h-4 text-black" />
              Chambers Member Roster & Governance
            </h3>
            <p className="text-xs text-neutral-500">Manage member privileges, office routing, promotions, and demotions.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search roster..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
              />
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Invite Member
            </button>
          </div>
        </div>

        {/* STAFF MEMBERS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
            <thead className="bg-neutral-100 text-black font-bold uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="p-3">Staff Member</th>
                <th className="p-3">Title & Level</th>
                <th className="p-3">Practice Area</th>
                <th className="p-3">Assigned Office</th>
                <th className="p-3 text-center">Actions & Role Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-900 bg-white">
              {filteredMembers.map((m) => {
                const rank = getMemberRank(m);
                return (
                  <tr key={m.uid} className="hover:bg-neutral-50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black text-white font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold block text-black">{m.name}</span>
                          <span className="text-[10px] text-neutral-500">{m.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold block text-black">{m.title || "Counsel"}</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-neutral-100 text-black text-[10px] font-mono font-bold rounded">
                        Rank {rank}
                      </span>
                    </td>

                    <td className="p-3 text-neutral-700 font-medium">
                      {m.practice || "Legal Counsel"}
                    </td>

                    <td className="p-3 font-mono font-bold text-black">
                      /{m.officeId || "counsel"}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handlePromoteMember(m)}
                          title="Promote Member"
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] inline-flex items-center gap-1 border border-emerald-200 cursor-pointer"
                        >
                          <ArrowUpRight className="w-3 h-3" /> Promote
                        </button>

                        <button
                          onClick={() => handleDemoteMember(m)}
                          title="Demote Member"
                          className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded text-[10px] inline-flex items-center gap-1 border border-neutral-200 cursor-pointer"
                        >
                          <ArrowDownRight className="w-3 h-3" /> Demote
                        </button>

                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="px-2 py-1 bg-black hover:bg-neutral-800 text-white font-bold rounded text-[10px] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>

                        <button
                          onClick={() => handleRemoveMember(m)}
                          title="Revoke Access"
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition cursor-pointer border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BROADCAST MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 w-full max-w-lg text-black space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-black" />
                <h3 className="font-bold text-black text-base font-mono uppercase">
                  Broadcast Firmwide Announcement
                </h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-black uppercase tracking-wider block mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Firm Directive: Q3 Billing Submission Thresholds"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-black uppercase tracking-wider block mb-1">
                  Priority / Urgency
                </label>
                <select
                  value={broadcastUrgency}
                  onChange={(e) => setBroadcastUrgency(e.target.value as any)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-black"
                >
                  <option value="Normal">Normal Firm Broadcast</option>
                  <option value="Urgent">Urgent Executive Directive</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-black uppercase tracking-wider block mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter the official directive message to be broadcasted to all member dockets..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingBroadcast}
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" /> Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 w-full max-w-md text-black space-y-4">
            <h3 className="font-bold text-black text-base font-mono uppercase pb-2 border-b border-neutral-200">
              Edit Permissions: {editingMember.name}
            </h3>

            <form onSubmit={handleSaveMemberEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-black block mb-1">Official Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Practice Specialization:</label>
                <input
                  type="text"
                  value={editPractice}
                  onChange={(e) => setEditPractice(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Assigned Chambers Office Route:</label>
                <select
                  value={editOffice}
                  onChange={(e) => setEditOffice(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg"
                >
                  <option value="prince">Managing Partner Office (/prince)</option>
                  <option value="kelvin">Senior Partner Chambers (/kelvin)</option>
                  <option value="donel">IP Chambers (/donel)</option>
                  <option value="linet">Commercial & Finance Office (/linet)</option>
                  <option value="counsel">General Counsel Chambers (/counsel)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showEventModal && (
        <HostEventModal
          onClose={() => setShowEventModal(false)}
          onCreated={() => {
            setShowEventModal(false);
            alert("New Event hosted and added to firm symposia roster!");
          }}
        />
      )}

      {/* INVITE MODAL */}
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
    </div>
  );
};
