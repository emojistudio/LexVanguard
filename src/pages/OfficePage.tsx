import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { subscribeFirestoreMembers, ATTORNEY_NAMES } from "@/lib/users";
import { loadProfile, saveProfile, handleProfileImageError } from "@/lib/profile-store";
import { uploadToImgBB } from "@/lib/imgbb";
import {
  subscribeTasks, addTask, updateTaskStatus, deleteTask, ChambersTask,
  subscribeMatters, addMatter, updateMatterStatus, deleteMatter, ChambersMatter,
  subscribeLogs, addLog, ActivityLog,
  subscribeDocs, addDocument, deleteDocument, ChambersDocument
} from "@/lib/office-store";
import {
  Calendar, FileText, Scale, BookOpen, Search,
  Bell, CheckCircle, Briefcase, LogOut, ChevronRight,
  Users, BarChart2, AlertCircle, Star, Clock,
  X, Upload, Plus, Loader2, Trash2, MessageSquare, Sparkles, ShieldCheck, ArrowUpRight
} from "lucide-react";
import Header from "@/components/Header";
import { InviteModal } from "@/components/InviteModal";
import { ChambersDirectMessages } from "@/components/ChambersDirectMessages";
import { ChambersFinanceSuite } from "@/components/ChambersFinanceSuite";
import { ChambersAdminSuite } from "@/components/ChambersAdminSuite";
import { ResearchCoHelper } from "@/components/ResearchCoHelper";

const OFFICE_CONFIG: Record<string, {
  accentHex: string;
  greeting: string;
  quote: string;
  stats: { label: string; icon: React.ReactNode }[];
  quickLinks: { label: string; icon: React.ReactNode }[];
}> = {
  prince: {
    accentHex: "#000000",
    greeting: "Managing Partner's Office",
    quote: "Leadership in law demands mastery of doctrine, precision, and strategy.",
    stats: [
      { label: "Active Cases", icon: <Briefcase className="w-4 h-4 text-black" /> },
      { label: "Pending Reviews", icon: <Clock className="w-4 h-4 text-black" /> },
      { label: "Deadlines", icon: <AlertCircle className="w-4 h-4 text-rose-500" /> },
      { label: "Clients", icon: <Users className="w-4 h-4 text-black" /> }
    ],
    quickLinks: [
      { label: "Firm Overview", icon: <BarChart2 className="w-4 h-4 text-neutral-500" /> },
      { label: "Personnel Directory", icon: <Users className="w-4 h-4 text-neutral-500" /> },
      { label: "M&A Pipeline", icon: <Briefcase className="w-4 h-4 text-neutral-500" /> },
      { label: "Corporate Filings", icon: <FileText className="w-4 h-4 text-neutral-500" /> }
    ]
  },
  kelvin: {
    accentHex: "#000000",
    greeting: "Senior Partner's Chambers",
    quote: "The appellate court is where law is shaped with precedent and scholarship.",
    stats: [
      { label: "Active Appeals", icon: <Scale className="w-4 h-4 text-black" /> },
      { label: "Briefs Pending", icon: <FileText className="w-4 h-4 text-black" /> },
      { label: "Court Dates", icon: <Calendar className="w-4 h-4 text-rose-500" /> },
      { label: "Cases Researched", icon: <BookOpen className="w-4 h-4 text-black" /> }
    ],
    quickLinks: [
      { label: "Appellate Docket", icon: <Scale className="w-4 h-4 text-neutral-500" /> },
      { label: "Brief Repository", icon: <FileText className="w-4 h-4 text-neutral-500" /> },
      { label: "Case Law Research", icon: <BookOpen className="w-4 h-4 text-neutral-500" /> },
      { label: "Court Filings", icon: <Star className="w-4 h-4 text-neutral-500" /> }
    ]
  },
  counsel: {
    accentHex: "#000000",
    greeting: "Counsel's Chambers",
    quote: "Diligent research and precise legal counsel form our bedrock.",
    stats: [
      { label: "Active Matters", icon: <Briefcase className="w-4 h-4 text-black" /> },
      { label: "Advisory Briefs", icon: <FileText className="w-4 h-4 text-black" /> },
      { label: "Consultations", icon: <Clock className="w-4 h-4 text-black" /> },
      { label: "Opinions Rendered", icon: <Scale className="w-4 h-4 text-black" /> }
    ],
    quickLinks: [
      { label: "Counsel Docket", icon: <Scale className="w-4 h-4 text-neutral-500" /> },
      { label: "Legal Opinions", icon: <FileText className="w-4 h-4 text-neutral-500" /> },
      { label: "Precedent Research", icon: <BookOpen className="w-4 h-4 text-neutral-500" /> },
      { label: "Client Advisory", icon: <Users className="w-4 h-4 text-neutral-500" /> }
    ]
  }
};

// ---------------- Modals ----------------

function CalendarModal({ onClose }: { onClose: () => void }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden text-black" onClick={e => e.stopPropagation()}>
        <div className="bg-black text-white p-4 flex justify-between items-center border-b border-neutral-800">
          <h3 className="text-xs font-mono font-bold tracking-widest uppercase">{monthName} {year}</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map((d,i) => (
              <div key={i} className="text-[10px] font-mono font-bold text-neutral-400 py-1 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {blanks.map(i => <div key={`b${i}`} />)}
            {days.map(d => (
              <button key={d} className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer
                ${d === today.getDate() ? 'bg-black text-white font-mono' : 'hover:bg-neutral-100 text-black'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 bg-neutral-50 border-t border-neutral-200 text-center">
          <p className="text-[11px] text-neutral-600 font-medium">Court calendar synced with LexVanguard Docket</p>
        </div>
      </div>
    </div>
  );
}

function NewFileModal({ officeId, userName, onClose }: { officeId: string; userName: string; onClose: () => void }) {
  const [tab, setTab] = useState<'create' | 'upload'>('create');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Brief');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await addDocument({
      officeId,
      title: title.trim(),
      type,
      uploadedBy: userName,
      size: "1.8 MB"
    });
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden text-black" onClick={e => e.stopPropagation()}>
        <div className="bg-black text-white p-4 flex justify-between items-center border-b border-neutral-800">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest">File New Document</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex border-b border-neutral-200 bg-neutral-100">
          {(['create', 'upload'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${tab === t ? 'bg-white text-black border-b-2 border-black' : 'text-neutral-500 hover:text-black'}`}>
              {t === 'create' ? <><Plus className="w-3.5 h-3.5 inline mr-1.5" />New Record</> : <><Upload className="w-3.5 h-3.5 inline mr-1.5" />Upload File</>}
            </button>
          ))}
        </div>
        {saved ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-8 h-8 text-black mx-auto mb-2" />
            <p className="text-sm font-bold text-black">Document saved to Chambers repository!</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {tab === 'create' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Document Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Appellate Brief — Kariuki v. AG"
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Category</label>
                  <select value={type} onChange={e => setType(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black">
                    {['Brief', 'Legal Memo', 'Contract', 'Research Note', 'Client Intake', 'Court Filing'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="w-full bg-black hover:bg-neutral-800 text-white rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "File Document"}
                </button>
              </>
            ) : (
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-black transition-colors cursor-pointer bg-neutral-50"
                   onClick={() => {
                     const name = prompt("Enter file name to upload:");
                     if (name) {
                       setTitle(name);
                       handleSave();
                     }
                   }}>
                <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-black">Click to select document file</p>
                <p className="text-[10px] text-neutral-500 mt-1 font-mono">PDF, DOCX up to 25MB</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NewTaskModal({ officeId, defaultAssignee, members, onClose }: { officeId: string; defaultAssignee: string; members: string[]; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(defaultAssignee);
  const [due, setDue] = useState('Aug 15, 2026');
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">('High');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await addTask({
      officeId,
      title: title.trim(),
      assignee,
      due,
      status: "Pending",
      priority,
      description: description.trim() || "Task created in Chambers workspace."
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden text-black" onClick={e => e.stopPropagation()}>
        <div className="bg-black text-white p-4 flex justify-between items-center border-b border-neutral-800">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2">
            <Plus className="w-4 h-4 text-white" /> Create Task Assignment
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Task Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="e.g. Review Discovery Documents for TechCorp"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Assignee</label>
              <select value={assignee} onChange={e => setAssignee(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black">
                {members.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as any)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Due Date</label>
            <input value={due} onChange={e => setDue(e.target.value)}
              placeholder="e.g. Aug 20, 2026 or Tomorrow 5 PM"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black" />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Description & Requirements</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="Provide specific instructions for counsel..."
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black" />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3.5 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NewMatterModal({ officeId, defaultLead, members, onClose }: { officeId: string; defaultLead: string; members: string[]; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState<"Active" | "Pending" | "In Review">('Active');
  const [urgency, setUrgency] = useState<"Low" | "Medium" | "High">('High');
  const [leadAttorney, setLeadAttorney] = useState(defaultLead);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) return;
    setSaving(true);
    await addMatter({
      officeId,
      title: title.trim(),
      client: client.trim(),
      status,
      urgency,
      leadAttorney,
      description: description.trim() || "Active case file opened."
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden text-black" onClick={e => e.stopPropagation()}>
        <div className="bg-black text-white p-4 flex justify-between items-center border-b border-neutral-800">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2">
            <Scale className="w-4 h-4 text-white" /> Open New Matter File
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Matter Title / Case Name</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="e.g. Commercial Litigation Phase II"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black" />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Client Name</label>
            <input value={client} onChange={e => setClient(e.target.value)} required
              placeholder="e.g. Vanguard Tech Corp"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black">
                <option value="Active">Active</option>
                <option value="In Review">In Review</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Lead Counsel</label>
              <select value={leadAttorney} onChange={e => setLeadAttorney(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black">
                {members.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Matter Description & Objectives</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="Summary of legal objectives, court forum, or arbitration terms..."
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-black" />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3.5 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : "Open Matter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose }: { task: ChambersTask; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden text-black" onClick={e => e.stopPropagation()}>
        <div className="bg-black text-white p-4 flex justify-between items-start border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-white leading-snug">{task.title}</h3>
            <p className="text-neutral-400 text-xs mt-0.5 font-mono">Due: {task.due}</p>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Status</p>
              <p className={`font-bold ${task.status === 'Completed' ? 'text-emerald-700' : task.status === 'In Progress' ? 'text-amber-700' : 'text-neutral-700'}`}>{task.status}</p>
            </div>
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Priority</p>
              <p className={`font-bold ${task.priority === 'High' ? 'text-rose-700' : 'text-amber-700'}`}>{task.priority}</p>
            </div>
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Assignee</p>
              <p className="font-bold text-black text-[11px] truncate">{task.assignee}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-black uppercase tracking-wider mb-1">Details & Scope</p>
            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200">{task.description}</p>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              {task.status !== 'Completed' && (
                <button onClick={() => { updateTaskStatus(task.id, 'Completed'); onClose(); }}
                  className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center gap-1 cursor-pointer">
                  <CheckCircle className="w-3.5 h-3.5" /> Complete
                </button>
              )}
              {task.status === 'Pending' && (
                <button onClick={() => { updateTaskStatus(task.id, 'In Progress'); onClose(); }}
                  className="px-3.5 py-1.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer">
                  Start Working
                </button>
              )}
            </div>
            <button onClick={() => { deleteTask(task.id); onClose(); }} className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-3 bg-neutral-50 border-t border-neutral-200 text-right">
          <button onClick={onClose} className="px-5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function EditableStat({ label, icon, value }: { label: string; icon: React.ReactNode; value: string | number }) {
  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-xl bg-neutral-100">{icon}</div>
      </div>
      <span className="text-2xl font-bold text-black block">{value}</span>
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mt-0.5 block">{label}</span>
    </div>
  );
}

// ---------------- Main Component ----------------

export default function OfficePage() {
  const params = useParams<{ officeId?: string }>();
  const officeId = params.officeId || "counsel";
  const [, setLocation] = useLocation();
  const { firmUser, loading, logout } = useAuth();

  // Tier State: "counsel" | "finance" | "admin"
  const [activeTier, setActiveTier] = useState<"counsel" | "finance" | "admin">("counsel");

  const [showCalendar, setShowCalendar] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewMatterModal, setShowNewMatterModal] = useState(false);
  const [showDeskModal, setShowDeskModal] = useState(false);
  const [activeTask, setActiveTask] = useState<ChambersTask | null>(null);

  const [profile, setProfile] = useState(() => firmUser ? loadProfile(firmUser.name) : null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Real Stores State
  const [tasks, setTasks] = useState<ChambersTask[]>([]);
  const [matters, setMatters] = useState<ChambersMatter[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [docs, setDocs] = useState<ChambersDocument[]>([]);
  const [memberNames, setMemberNames] = useState<string[]>(ATTORNEY_NAMES);

  // Filters
  const [taskFilter, setTaskFilter] = useState<"All" | "Pending" | "In Progress" | "Completed">("All");
  const [matterFilter, setMatterFilter] = useState<"All" | "Active" | "In Review" | "Pending">("All");

  useEffect(() => {
    if (!loading && !firmUser) { setLocation("/login"); return; }
    if (firmUser) { 
      setProfile(loadProfile(firmUser.name)); 

      const userOffice = (firmUser.officeId || officeId || "").toLowerCase().trim();

      if (userOffice === "admin") {
        setActiveTier("admin");
      } else if (userOffice === "finance") {
        setActiveTier("finance");
      } else {
        setActiveTier("counsel");
      }
    }
  }, [firmUser, loading, officeId, setLocation]);

  const userOfficeStr = (firmUser?.officeId || "").toLowerCase().trim();

  const assignedTier: "counsel" | "finance" | "admin" = (
    userOfficeStr === "admin" ? "admin" :
    userOfficeStr === "finance" ? "finance" : "counsel"
  );

  useEffect(() => {
    const unsubTasks = subscribeTasks(setTasks);
    const unsubMatters = subscribeMatters(setMatters);
    const unsubLogs = subscribeLogs(setLogs);
    const unsubDocs = subscribeDocs(setDocs);

    const unsubMembers = subscribeFirestoreMembers((members) => {
      const names = Array.from(new Set(members.map(m => m.name)));
      if (names.length > 0) setMemberNames(names);
    });

    return () => {
      unsubTasks();
      unsubMatters();
      unsubLogs();
      unsubDocs();
      unsubMembers();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!firmUser || !profile) return null;

  const config = OFFICE_CONFIG[officeId] || OFFICE_CONFIG["counsel"];

  const updateProfile = (field: keyof typeof profile, value: string) => {
    const updated = { ...profile!, [field]: value };
    setProfile(updated);
    saveProfile(updated);
  };

  // Filter calculations
  const activeMattersCount = matters.filter(m => m.status === "Active").length;
  const pendingTasksCount = tasks.filter(t => t.status !== "Completed").length;
  const highPriorityCount = tasks.filter(t => t.priority === "High" && t.status !== "Completed").length;
  const totalDocsCount = docs.length;

  const filteredTasks = tasks.filter(t => taskFilter === "All" || t.status === taskFilter);
  const filteredMatters = matters.filter(m => matterFilter === "All" || m.status === matterFilter);
  const visibleAlerts = showAllAlerts ? logs : logs.slice(0, 4);

  const isFounder = firmUser && (firmUser.role.level >= 100 || ['prince', 'kelvin', 'donel'].includes(firmUser.officeId));

  const renderLogIcon = (type: ActivityLog["iconType"]) => {
    switch (type) {
      case "file": return <FileText className="w-3.5 h-3.5 text-black" />;
      case "check": return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case "bell": return <Bell className="w-3.5 h-3.5 text-black" />;
      case "alert": return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      case "user": return <Users className="w-3.5 h-3.5 text-black" />;
      default: return <Bell className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-black font-sans antialiased">
      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}
      {showNewFile && <NewFileModal officeId={officeId} userName={firmUser.name} onClose={() => setShowNewFile(false)} />}
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
      {showNewTaskModal && <NewTaskModal officeId={officeId} defaultAssignee={firmUser.name} members={memberNames} onClose={() => setShowNewTaskModal(false)} />}
      {showNewMatterModal && <NewMatterModal officeId={officeId} defaultLead={firmUser.name} members={memberNames} onClose={() => setShowNewMatterModal(false)} />}
      {activeTask && <TaskDetailModal task={activeTask} onClose={() => setActiveTask(null)} />}

      {/* DESK APP MODAL */}
      {showDeskModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl bg-white border border-neutral-300 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-black">
            <div className="bg-black text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white text-black font-mono font-bold flex items-center justify-center text-xs">
                  DESK
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Desk — AI Legal Research & Citation Engine
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-neutral-400">LexVanguard Member AI Assistant • Precedents & Statutory Search</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeskModal(false)}
                className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-neutral-50 p-4 sm:p-6">
              <ResearchCoHelper
                currentOfficeId={officeId}
                userName={firmUser.name}
                onClose={() => setShowDeskModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-black text-white">
        <Header />
      </div>

      <main className="w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-6">

        {/* Minimalist Apple Profile Header Bar */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0 group">
              <img
                src={profile.image}
                alt={firmUser.name}
                onError={(e) => handleProfileImageError(e, firmUser.name)}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
              />
              <label className="absolute inset-0 bg-black/80 text-white flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1">
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setUploadingImage(true);
                      const imageUrl = await uploadToImgBB(file, firmUser.name);
                      updateProfile('image', imageUrl);
                    } catch (err: any) {
                      alert("Upload failed: " + (err?.message || "Try again"));
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-black">{firmUser.name}</h1>
                <span className="px-2.5 py-0.5 bg-black text-white rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  {firmUser.role.name}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                {profile.practice} • {profile.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowCalendar(true)}
              className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-black px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-200">
              <Calendar className="w-3.5 h-3.5 text-black" /> Calendar
            </button>
            <button onClick={() => setShowNewFile(true)}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
              <FileText className="w-3.5 h-3.5 text-white" /> New File
            </button>
            <button onClick={logout}
              className="inline-flex items-center gap-1.5 border border-neutral-200 hover:bg-rose-50 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* ASSIGNED OFFICE DISPLAY & SELECTOR */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTier("counsel")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTier === "counsel"
                  ? "bg-black text-white shadow-xs font-mono"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Counsel Office</span>
              {assignedTier === "counsel" && (
                <span className="bg-amber-400 text-black text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  Assigned
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTier("finance")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTier === "finance"
                  ? "bg-black text-white shadow-xs font-mono"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>Finance Office</span>
              {assignedTier === "finance" && (
                <span className="bg-emerald-400 text-black text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  Assigned
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTier("admin")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTier === "admin"
                  ? "bg-black text-white shadow-xs font-mono"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Office</span>
              {assignedTier === "admin" && (
                <span className="bg-purple-300 text-black text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  Assigned
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium px-2 self-end sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-neutral-600">
              Firestore officeId: <span className="text-black font-extrabold underline">{firmUser?.officeId || "counsel"}</span>
            </span>
          </div>
        </div>

        {/* TIER 1: ADMIN OFFICE */}
        {activeTier === "admin" && <ChambersAdminSuite />}

        {/* TIER 2: FINANCE OFFICE */}
        {activeTier === "finance" && <ChambersFinanceSuite />}

        {/* TIER 3: COUNSEL OFFICE */}
        {activeTier === "counsel" && (
          <div className="space-y-6">

            {/* DESK - GRAPHICAL SQUARE OFFICE ICON TEASER */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 shadow-md relative overflow-hidden group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  {/* Graphical Square Office Icon */}
                  <div 
                    onClick={() => setShowDeskModal(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-800 border-2 border-amber-500/50 hover:border-amber-400 text-amber-400 flex flex-col items-center justify-center p-2 shadow-lg group-hover:scale-105 transition-all cursor-pointer shrink-0"
                  >
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mb-1" />
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-white">DESK</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDeskModal(true)}
                  className="bg-white hover:bg-neutral-200 text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer group-hover:bg-amber-400"
                >
                  <BookOpen className="w-4 h-4 text-black" />
                  <span>Launch Desk App</span>
                  <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Counsel Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <EditableStat label="Active Matters" icon={<Briefcase className="w-4 h-4 text-black" />} value={activeMattersCount} />
              <EditableStat label="Pending Tasks" icon={<Clock className="w-4 h-4 text-black" />} value={pendingTasksCount} />
              <EditableStat label="High Priority" icon={<AlertCircle className="w-4 h-4 text-rose-500" />} value={highPriorityCount} />
              <EditableStat label="Filed Documents" icon={<FileText className="w-4 h-4 text-black" />} value={totalDocsCount} />
            </div>

            {/* Counsel Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main Docket Column */}
              <div className="lg:col-span-2 space-y-6">

                {/* Active Matters & Personal Docket */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-black" />
                      <h3 className="text-sm font-bold text-black font-mono uppercase">Personal Docket & Active Matters</h3>
                      <span className="text-xs text-neutral-400 font-normal">({matters.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex bg-neutral-100 p-0.5 rounded-lg text-[11px]">
                        {(["All", "Active", "In Review", "Pending"] as const).map(f => (
                          <button key={f} onClick={() => setMatterFilter(f)}
                            className={`px-2.5 py-1 rounded-md transition-colors font-bold uppercase ${matterFilter === f ? "bg-black text-white shadow-xs" : "text-neutral-500 hover:text-black"}`}>
                            {f}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setShowNewMatterModal(true)}
                        className="inline-flex items-center gap-1 bg-black hover:bg-neutral-800 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                        <Plus className="w-3.5 h-3.5 text-white" /> Open Matter
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral-200">
                    {filteredMatters.length === 0 ? (
                      <div className="p-8 text-center text-neutral-400 text-xs">
                        No matter files matching filter "{matterFilter}".
                      </div>
                    ) : (
                      filteredMatters.map(m => (
                        <div key={m.id} className="p-4 hover:bg-neutral-50 transition-colors flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-black">{m.title}</h4>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                                m.urgency === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-neutral-100 text-black'
                              }`}>
                                {m.urgency} Urgency
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              Client: <strong className="text-black">{m.client}</strong> {m.leadAttorney && `• Lead: ${m.leadAttorney}`} — {m.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <select value={m.status} onChange={e => updateMatterStatus(m.id, e.target.value as any)}
                              className="px-2 py-1 bg-neutral-50 border border-neutral-300 rounded-lg text-[10px] font-bold text-black focus:outline-none">
                              <option value="Active">Active</option>
                              <option value="In Review">In Review</option>
                              <option value="Pending">Pending</option>
                              <option value="Closed">Closed</option>
                            </select>
                            <button onClick={() => deleteMatter(m.id)} className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Task Management */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-black" />
                      <h3 className="text-sm font-bold text-black font-mono uppercase">Counsel Tasks & Assignments</h3>
                      <span className="text-xs text-neutral-400 font-normal">({tasks.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex bg-neutral-100 p-0.5 rounded-lg text-[11px]">
                        {(["All", "Pending", "In Progress", "Completed"] as const).map(f => (
                          <button key={f} onClick={() => setTaskFilter(f)}
                            className={`px-2.5 py-1 rounded-md transition-colors font-bold uppercase ${taskFilter === f ? "bg-black text-white shadow-xs" : "text-neutral-500 hover:text-black"}`}>
                            {f}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setShowNewTaskModal(true)}
                        className="inline-flex items-center gap-1 bg-black hover:bg-neutral-800 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                        <Plus className="w-3.5 h-3.5 text-white" /> Add Task
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral-200">
                    {filteredTasks.length === 0 ? (
                      <div className="p-8 text-center text-neutral-400 text-xs">
                        No tasks found matching filter "{taskFilter}".
                      </div>
                    ) : (
                      filteredTasks.map(task => (
                        <div key={task.id} className="p-4 hover:bg-neutral-50 transition-colors flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className={`text-xs font-bold ${task.status === 'Completed' ? 'text-neutral-400 line-through' : 'text-black'}`}>
                                {task.title}
                              </h4>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                                task.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-neutral-100 text-black'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5">Assigned: <strong className="text-black">{task.assignee}</strong> • Due: {task.due}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => updateTaskStatus(task.id, task.status === 'Completed' ? 'In Progress' : 'Completed')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                task.status === 'In Progress' ? 'bg-amber-100 text-amber-900' : 'bg-neutral-100 text-black hover:bg-neutral-200'
                              }`}>
                              {task.status}
                            </button>
                            <button onClick={() => setActiveTask(task)}
                              className="text-xs font-bold text-black hover:underline transition-colors p-1 cursor-pointer">
                              Details
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Direct Messages Component */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-100 flex items-center justify-between">
                    <h3 className="text-xs font-bold font-mono text-black uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-black" /> Direct Messaging & Counsel Chat
                    </h3>
                  </div>
                  <div className="p-4">
                    <ChambersDirectMessages />
                  </div>
                </div>

                {/* Document Repository */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-black" />
                      <h3 className="text-sm font-bold text-black font-mono uppercase">Document Repository & Briefs</h3>
                    </div>
                    <button onClick={() => setShowNewFile(true)}
                      className="text-xs text-black font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> File Document
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-200">
                    {docs.length === 0 ? (
                      <div className="p-8 text-center text-neutral-400 text-xs">No filed documents.</div>
                    ) : (
                      docs.map(doc => (
                        <div key={doc.id} className="p-4 hover:bg-neutral-50 transition-colors flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-100 rounded-lg text-black">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-black">{doc.title}</h4>
                              <p className="text-[11px] text-neutral-500 mt-0.5">Category: {doc.type} • Filed by {doc.uploadedBy} on {doc.uploadedAt}</p>
                            </div>
                          </div>
                          <button onClick={() => deleteDocument(doc.id)} className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">

                {/* Chambers Activity Stream */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <h3 className="text-xs font-bold text-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-black" /> Chambers Activity Log
                    </h3>
                    <button onClick={() => setShowAllAlerts(!showAllAlerts)} className="text-[11px] font-bold text-black uppercase hover:underline cursor-pointer">
                      {showAllAlerts ? 'Less' : 'All'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {visibleAlerts.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">No activity entries yet.</p>
                    ) : (
                      visibleAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-1 bg-neutral-100 rounded-md">{renderLogIcon(alert.iconType)}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-black leading-tight">{alert.title}</p>
                            {alert.details && <p className="text-[10px] text-neutral-600 mt-0.5">{alert.details}</p>}
                            <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{alert.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Launch Card */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 space-y-3">
                  <h3 className="text-xs font-bold text-black font-mono uppercase tracking-wider">Quick Actions</h3>
                  <div className="space-y-2">
                    <button onClick={() => setShowDeskModal(true)} className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 text-white hover:bg-black transition-colors text-left group cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">Desk — AI Research</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button onClick={() => setLocation('/attorneys')} className="w-full flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-left group cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-black" />
                        <span className="text-xs font-bold text-black">Attorneys Directory</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* User Account Card */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs font-mono">
                      {firmUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black">{firmUser.name}</p>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase">{firmUser.role.name}</p>
                    </div>
                  </div>
                  <button onClick={logout}
                    className="w-full flex items-center justify-center gap-1.5 border border-neutral-200 hover:bg-rose-50 text-rose-700 rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
