import { db } from "./firebase";
import { collection, onSnapshot, setDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";

export interface ChambersTask {
  id: string;
  officeId: string;
  title: string;
  assignee: string;
  due: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  description: string;
  createdAt: string;
  createdBy?: string;
}

export interface ChambersMatter {
  id: string;
  officeId: string;
  title: string;
  client: string;
  status: "Active" | "Pending" | "In Review" | "Closed";
  urgency: "Low" | "Medium" | "High";
  description: string;
  leadAttorney?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  officeId: string;
  iconType: "file" | "check" | "bell" | "alert" | "user";
  title: string;
  details?: string;
  actorName?: string;
  time: string;
  timestamp: number;
}

export interface ChambersDocument {
  id: string;
  officeId: string;
  title: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size?: string;
  fileUrl?: string;
}

export interface ChambersResearchItem {
  id: string;
  officeId: string;
  matterId?: string;
  matterTitle?: string;
  query: string;
  summary: string;
  sources: { title: string; uri: string }[];
  notes?: string;
  createdByName: string;
  createdAt: string;
}

export interface ChambersSubmission {
  id: string;
  officeId: string;
  matterId?: string;
  matterTitle: string;
  submissionType: string;
  courtForum: string;
  title: string;
  content: string;
  createdByName: string;
  createdAt: string;
  status: "Draft" | "Final" | "Filed";
}

export interface DirectMessage {
  id: string;
  senderUid: string;
  senderName: string;
  recipientUid: string; // member UID or 'all'
  recipientName: string;
  content: string;
  timestamp: string;
  timeFormatted: string;
  matterId?: string;
  matterTitle?: string;
  resourceTitle?: string;
  resourceUrl?: string;
}

export interface ChambersInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  matterTitle: string;
  officeId: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: "Draft" | "Issued" | "Paid" | "Overdue";
  items: { description: string; hoursOrQty: number; rate: number; total: number }[];
  notes?: string;
  paidAt?: string;
}

export interface StkPushTransaction {
  id: string;
  phoneNumber: string;
  amount: number;
  clientName: string;
  matterTitle: string;
  referenceDoc: string;
  status: "Pending" | "Success" | "Failed";
  mpesaReceiptNumber?: string;
  timestamp: string;
  initiatedBy: string;
}

// Initial default seed data (empty for dynamic database loading)
const INITIAL_TASKS: ChambersTask[] = [];
const INITIAL_MATTERS: ChambersMatter[] = [];
const INITIAL_LOGS: ActivityLog[] = [];
const INITIAL_DOCS: ChambersDocument[] = [];
const INITIAL_RESEARCH: ChambersResearchItem[] = [];
const INITIAL_SUBMISSIONS: ChambersSubmission[] = [];
const INITIAL_MESSAGES: DirectMessage[] = [];
const INITIAL_INVOICES: ChambersInvoice[] = [];
const INITIAL_TRANSACTIONS: StkPushTransaction[] = [];

// LocalStorage helpers
function loadLocal<T>(key: string, defaultVal: T): T {
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    }
  } catch (err) {
    console.warn("Error reading localStorage key:", key, err);
  }
  return defaultVal;
}

function saveLocal<T>(key: string, value: T) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn("Error writing localStorage key:", key, err);
  }
}

// Memory stores initialized from LocalStorage
let currentTasks: ChambersTask[] = loadLocal("lex_chambers_tasks", INITIAL_TASKS);
let currentMatters: ChambersMatter[] = loadLocal("lex_chambers_matters", INITIAL_MATTERS);
let currentLogs: ActivityLog[] = loadLocal("lex_chambers_logs", INITIAL_LOGS);
let currentDocs: ChambersDocument[] = loadLocal("lex_chambers_docs", INITIAL_DOCS);
let currentResearch: ChambersResearchItem[] = loadLocal("lex_chambers_research", INITIAL_RESEARCH);
let currentSubmissions: ChambersSubmission[] = loadLocal("lex_chambers_submissions", INITIAL_SUBMISSIONS);
let currentMessages: DirectMessage[] = loadLocal("lex_chambers_messages", INITIAL_MESSAGES);
let currentInvoices: ChambersInvoice[] = loadLocal("lex_chambers_invoices", INITIAL_INVOICES);
let currentTransactions: StkPushTransaction[] = loadLocal("lex_chambers_stk_tx", INITIAL_TRANSACTIONS);

// Listeners
type Callback<T> = (data: T[]) => void;
const taskListeners: Set<Callback<ChambersTask>> = new Set();
const matterListeners: Set<Callback<ChambersMatter>> = new Set();
const logListeners: Set<Callback<ActivityLog>> = new Set();
const docListeners: Set<Callback<ChambersDocument>> = new Set();
const researchListeners: Set<Callback<ChambersResearchItem>> = new Set();
const submissionListeners: Set<Callback<ChambersSubmission>> = new Set();
const messageListeners: Set<Callback<DirectMessage>> = new Set();
const invoiceListeners: Set<Callback<ChambersInvoice>> = new Set();
const stkListeners: Set<Callback<StkPushTransaction>> = new Set();

function notifyTasks() {
  saveLocal("lex_chambers_tasks", currentTasks);
  taskListeners.forEach(cb => cb([...currentTasks]));
}

function notifyMatters() {
  saveLocal("lex_chambers_matters", currentMatters);
  matterListeners.forEach(cb => cb([...currentMatters]));
}

function notifyLogs() {
  saveLocal("lex_chambers_logs", currentLogs);
  logListeners.forEach(cb => cb([...currentLogs]));
}

function notifyDocs() {
  saveLocal("lex_chambers_docs", currentDocs);
  docListeners.forEach(cb => cb([...currentDocs]));
}

function notifyResearch() {
  saveLocal("lex_chambers_research", currentResearch);
  researchListeners.forEach(cb => cb([...currentResearch]));
}

function notifySubmissions() {
  saveLocal("lex_chambers_submissions", currentSubmissions);
  submissionListeners.forEach(cb => cb([...currentSubmissions]));
}

function notifyMessages() {
  saveLocal("lex_chambers_messages", currentMessages);
  messageListeners.forEach(cb => cb([...currentMessages]));
}

function notifyInvoices() {
  saveLocal("lex_chambers_invoices", currentInvoices);
  invoiceListeners.forEach(cb => cb([...currentInvoices]));
}

function notifyStk() {
  saveLocal("lex_chambers_stk_tx", currentTransactions);
  stkListeners.forEach(cb => cb([...currentTransactions]));
}

// ----------------- Firestore Sync Setup -----------------
let initializedFirestore = false;

function setupFirestoreSync() {
  if (initializedFirestore || !db) return;
  initializedFirestore = true;

  try {
    // Sync Tasks
    const tasksRef = collection(db, "office_tasks");
    onSnapshot(tasksRef, (snap) => {
      const remoteTasks: ChambersTask[] = [];
      snap.forEach(d => remoteTasks.push({ id: d.id, ...d.data() } as ChambersTask));
      currentTasks = remoteTasks;
      notifyTasks();
    }, (err) => console.warn("Firestore tasks snapshot fallback to local:", err.message));

    // Sync Matters
    const mattersRef = collection(db, "matters");
    onSnapshot(mattersRef, (snap) => {
      const remoteMatters: ChambersMatter[] = [];
      snap.forEach(d => remoteMatters.push({ id: d.id, ...d.data() } as ChambersMatter));
      currentMatters = remoteMatters;
      notifyMatters();
    }, (err) => console.warn("Firestore matters snapshot fallback to local:", err.message));

    // Sync Audit Logs
    const logsRef = collection(db, "audit_logs");
    onSnapshot(logsRef, (snap) => {
      const remoteLogs: ActivityLog[] = [];
      snap.forEach(d => remoteLogs.push({ id: d.id, ...d.data() } as ActivityLog));
      remoteLogs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      currentLogs = remoteLogs;
      notifyLogs();
    }, (err) => console.warn("Firestore logs snapshot fallback to local:", err.message));

    // Sync Documents
    const docsRef = collection(db, "office_documents");
    onSnapshot(docsRef, (snap) => {
      const remoteDocs: ChambersDocument[] = [];
      snap.forEach(d => remoteDocs.push({ id: d.id, ...d.data() } as ChambersDocument));
      currentDocs = remoteDocs;
      notifyDocs();
    }, (err) => console.warn("Firestore docs snapshot fallback to local:", err.message));

    // Sync Research Items
    const researchRef = collection(db, "chambers_research");
    onSnapshot(researchRef, (snap) => {
      if (!snap.empty) {
        const remoteResearch: ChambersResearchItem[] = [];
        snap.forEach(d => remoteResearch.push(d.data() as ChambersResearchItem));
        currentResearch = remoteResearch;
        notifyResearch();
      }
    }, (err) => console.warn("Firestore research snapshot fallback to local:", err.message));

    // Sync Submissions
    const submissionsRef = collection(db, "chambers_submissions");
    onSnapshot(submissionsRef, (snap) => {
      if (!snap.empty) {
        const remoteSubmissions: ChambersSubmission[] = [];
        snap.forEach(d => remoteSubmissions.push(d.data() as ChambersSubmission));
        currentSubmissions = remoteSubmissions;
        notifySubmissions();
      }
    }, (err) => console.warn("Firestore submissions snapshot fallback to local:", err.message));

  } catch (err) {
    console.warn("Firestore setup warning:", err);
  }
}

// Call setup
setupFirestoreSync();

// ----------------- Public Subscription & CRUD API -----------------

// TASKS
export function subscribeTasks(cb: Callback<ChambersTask>): () => void {
  taskListeners.add(cb);
  cb([...currentTasks]);
  return () => taskListeners.delete(cb);
}

export async function addTask(task: Omit<ChambersTask, "id" | "createdAt">): Promise<ChambersTask> {
  const newTask: ChambersTask = {
    ...task,
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString()
  };

  currentTasks = [newTask, ...currentTasks];
  notifyTasks();

  // Record activity log
  addLog({
    officeId: newTask.officeId,
    iconType: "check",
    title: `New Task Assigned: ${newTask.title}`,
    details: `Assigned to ${newTask.assignee} (${newTask.priority} Priority)`,
    actorName: newTask.createdBy || newTask.assignee,
    time: "Just now"
  });

  // Try sync to Firestore
  try {
    if (db) {
      await setDoc(doc(db, "chambers_tasks", newTask.id), newTask);
    }
  } catch (err) {
    console.warn("Saved task locally (Firestore bypass):", err);
  }

  return newTask;
}

export async function updateTaskStatus(id: string, newStatus: ChambersTask["status"]): Promise<void> {
  let updatedTask: ChambersTask | null = null;
  currentTasks = currentTasks.map(t => {
    if (t.id === id) {
      updatedTask = { ...t, status: newStatus };
      return updatedTask;
    }
    return t;
  });

  notifyTasks();

  if (updatedTask) {
    addLog({
      officeId: (updatedTask as ChambersTask).officeId,
      iconType: newStatus === "Completed" ? "check" : "bell",
      title: `Task Status Updated: ${(updatedTask as ChambersTask).title}`,
      details: `Status set to ${newStatus}`,
      time: "Just now"
    });

    try {
      if (db) {
        await setDoc(doc(db, "chambers_tasks", id), updatedTask);
      }
    } catch (err) {
      console.warn("Updated task locally:", err);
    }
  }
}

export async function deleteTask(id: string): Promise<void> {
  const target = currentTasks.find(t => t.id === id);
  currentTasks = currentTasks.filter(t => t.id !== id);
  notifyTasks();

  if (target) {
    addLog({
      officeId: target.officeId,
      iconType: "alert",
      title: `Task Deleted: ${target.title}`,
      time: "Just now"
    });
  }

  try {
    if (db) {
      await deleteDoc(doc(db, "chambers_tasks", id));
    }
  } catch (err) {
    console.warn("Deleted task locally:", err);
  }
}

// MATTERS
export function subscribeMatters(cb: Callback<ChambersMatter>): () => void {
  matterListeners.add(cb);
  cb([...currentMatters]);
  return () => matterListeners.delete(cb);
}

export async function addMatter(matter: Omit<ChambersMatter, "id" | "createdAt">): Promise<ChambersMatter> {
  const newMatter: ChambersMatter = {
    ...matter,
    id: `matter_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString()
  };

  currentMatters = [newMatter, ...currentMatters];
  notifyMatters();

  addLog({
    officeId: newMatter.officeId,
    iconType: "file",
    title: `New Matter Opened: ${newMatter.title}`,
    details: `Client: ${newMatter.client} • Status: ${newMatter.status}`,
    actorName: newMatter.leadAttorney || "Chambers",
    time: "Just now"
  });

  try {
    if (db) {
      await setDoc(doc(db, "chambers_matters", newMatter.id), newMatter);
    }
  } catch (err) {
    console.warn("Saved matter locally:", err);
  }

  return newMatter;
}

export async function updateMatterStatus(id: string, newStatus: ChambersMatter["status"]): Promise<void> {
  let updatedMatter: ChambersMatter | null = null;
  currentMatters = currentMatters.map(m => {
    if (m.id === id) {
      updatedMatter = { ...m, status: newStatus };
      return updatedMatter;
    }
    return m;
  });

  notifyMatters();

  if (updatedMatter) {
    addLog({
      officeId: (updatedMatter as ChambersMatter).officeId,
      iconType: "file",
      title: `Matter Updated: ${(updatedMatter as ChambersMatter).title}`,
      details: `Status updated to ${newStatus}`,
      time: "Just now"
    });

    try {
      if (db) {
        await setDoc(doc(db, "chambers_matters", id), updatedMatter);
      }
    } catch (err) {
      console.warn("Updated matter locally:", err);
    }
  }
}

export async function deleteMatter(id: string): Promise<void> {
  const target = currentMatters.find(m => m.id === id);
  currentMatters = currentMatters.filter(m => m.id !== id);
  notifyMatters();

  if (target) {
    addLog({
      officeId: target.officeId,
      iconType: "alert",
      title: `Matter Archived/Removed: ${target.title}`,
      time: "Just now"
    });
  }

  try {
    if (db) {
      await deleteDoc(doc(db, "chambers_matters", id));
    }
  } catch (err) {
    console.warn("Deleted matter locally:", err);
  }
}

// LOGS
export function subscribeLogs(cb: Callback<ActivityLog>): () => void {
  logListeners.add(cb);
  cb([...currentLogs]);
  return () => logListeners.delete(cb);
}

export async function addLog(log: Omit<ActivityLog, "id" | "timestamp">): Promise<ActivityLog> {
  const newLog: ActivityLog = {
    ...log,
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: Date.now()
  };

  currentLogs = [newLog, ...currentLogs];
  notifyLogs();

  try {
    if (db) {
      await setDoc(doc(db, "chambers_logs", newLog.id), newLog);
    }
  } catch (err) {
    console.warn("Logged locally:", err);
  }

  return newLog;
}

export async function clearLogs(): Promise<void> {
  currentLogs = [];
  notifyLogs();
}

// DOCUMENTS
export function subscribeDocs(cb: Callback<ChambersDocument>): () => void {
  docListeners.add(cb);
  cb([...currentDocs]);
  return () => docListeners.delete(cb);
}

export async function addDocument(docData: Omit<ChambersDocument, "id" | "uploadedAt">): Promise<ChambersDocument> {
  const newDoc: ChambersDocument = {
    ...docData,
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    uploadedAt: new Date().toISOString().split("T")[0]
  };

  currentDocs = [newDoc, ...currentDocs];
  notifyDocs();

  addLog({
    officeId: newDoc.officeId,
    iconType: "file",
    title: `Document Filed: ${newDoc.title}`,
    details: `Type: ${newDoc.type} • Filed by ${newDoc.uploadedBy}`,
    actorName: newDoc.uploadedBy,
    time: "Just now"
  });

  try {
    if (db) {
      await setDoc(doc(db, "chambers_docs", newDoc.id), newDoc);
    }
  } catch (err) {
    console.warn("Document saved locally:", err);
  }

  return newDoc;
}

export async function deleteDocument(id: string): Promise<void> {
  currentDocs = currentDocs.filter(d => d.id !== id);
  notifyDocs();

  try {
    if (db) {
      await deleteDoc(doc(db, "chambers_docs", id));
    }
  } catch (err) {
    console.warn("Deleted doc locally:", err);
  }
}

// RESEARCH ITEMS
export function subscribeResearch(cb: Callback<ChambersResearchItem>): () => void {
  researchListeners.add(cb);
  cb([...currentResearch]);
  return () => researchListeners.delete(cb);
}

export async function addResearchItem(item: Omit<ChambersResearchItem, "id" | "createdAt">): Promise<ChambersResearchItem> {
  const newItem: ChambersResearchItem = {
    ...item,
    id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString().split("T")[0]
  };

  currentResearch = [newItem, ...currentResearch];
  notifyResearch();

  addLog({
    officeId: newItem.officeId,
    iconType: "file",
    title: `Legal Research Saved: ${newItem.query.slice(0, 45)}...`,
    details: `Linked to: ${newItem.matterTitle || 'Chambers Repository'}`,
    actorName: newItem.createdByName,
    time: "Just now"
  });

  try {
    if (db) {
      await setDoc(doc(db, "chambers_research", newItem.id), newItem);
    }
  } catch (err) {
    console.warn("Saved research item locally:", err);
  }

  return newItem;
}

export async function deleteResearchItem(id: string): Promise<void> {
  currentResearch = currentResearch.filter(r => r.id !== id);
  notifyResearch();

  try {
    if (db) {
      await deleteDoc(doc(db, "chambers_research", id));
    }
  } catch (err) {
    console.warn("Deleted research item locally:", err);
  }
}

// SUBMISSIONS
export function subscribeSubmissions(cb: Callback<ChambersSubmission>): () => void {
  submissionListeners.add(cb);
  cb([...currentSubmissions]);
  return () => submissionListeners.delete(cb);
}

export async function addSubmission(sub: Omit<ChambersSubmission, "id" | "createdAt">): Promise<ChambersSubmission> {
  const newSub: ChambersSubmission = {
    ...sub,
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString().split("T")[0]
  };

  currentSubmissions = [newSub, ...currentSubmissions];
  notifySubmissions();

  addLog({
    officeId: newSub.officeId,
    iconType: "file",
    title: `Court Submission Drafted: ${newSub.title}`,
    details: `${newSub.submissionType} for ${newSub.matterTitle} (${newSub.courtForum})`,
    actorName: newSub.createdByName,
    time: "Just now"
  });

  try {
    if (db) {
      await setDoc(doc(db, "chambers_submissions", newSub.id), newSub);
    }
  } catch (err) {
    console.warn("Saved submission locally:", err);
  }

  return newSub;
}

export async function updateSubmissionStatus(id: string, status: "Draft" | "Final" | "Filed"): Promise<void> {
  let targetOfficeId = "all";
  let targetTitle = "";

  currentSubmissions = currentSubmissions.map(s => {
    if (s.id === id) {
      targetOfficeId = s.officeId;
      targetTitle = s.title;
      return { ...s, status };
    }
    return s;
  });

  notifySubmissions();

  if (targetTitle) {
    addLog({
      officeId: targetOfficeId,
      iconType: "check",
      title: `Submission Status Updated: ${targetTitle}`,
      details: `New Status: ${status}`,
      time: "Just now"
    });
  }

  const updated = currentSubmissions.find(s => s.id === id);
  if (updated && db) {
    try {
      await setDoc(doc(db, "chambers_submissions", id), updated);
    } catch (err) {
      console.warn("Updated submission status locally:", err);
    }
  }
}

export async function deleteSubmission(id: string): Promise<void> {
  currentSubmissions = currentSubmissions.filter(s => s.id !== id);
  notifySubmissions();

  try {
    if (db) {
      await deleteDoc(doc(db, "chambers_submissions", id));
    }
  } catch (err) {
    console.warn("Deleted submission locally:", err);
  }
}

// DIRECT MESSAGES
export function subscribeMessages(cb: Callback<DirectMessage>): () => void {
  messageListeners.add(cb);
  cb([...currentMessages]);
  return () => messageListeners.delete(cb);
}

export async function addDirectMessage(msg: Omit<DirectMessage, "id" | "timestamp" | "timeFormatted">): Promise<DirectMessage> {
  const newMsg: DirectMessage = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    timeFormatted: "Just now"
  };

  currentMessages = [newMsg, ...currentMessages];
  notifyMessages();

  try {
    if (db) {
      await setDoc(doc(db, "chambers_messages", newMsg.id), newMsg);
    }
  } catch (err) {
    console.warn("Saved direct message locally:", err);
  }

  return newMsg;
}

export async function deleteDirectMessage(id: string): Promise<void> {
  currentMessages = currentMessages.filter(m => m.id !== id);
  notifyMessages();

  try {
    if (db) {
      await deleteDoc(doc(db, "chambers_messages", id));
    }
  } catch (err) {
    console.warn("Deleted message locally:", err);
  }
}

// INVOICES & RECEIPTS
export function subscribeInvoices(cb: Callback<ChambersInvoice>): () => void {
  invoiceListeners.add(cb);
  cb([...currentInvoices]);
  return () => invoiceListeners.delete(cb);
}

export async function addInvoice(inv: Omit<ChambersInvoice, "id">): Promise<ChambersInvoice> {
  const newInv: ChambersInvoice = {
    ...inv,
    id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
  };

  currentInvoices = [newInv, ...currentInvoices];
  notifyInvoices();

  addLog({
    officeId: inv.officeId,
    iconType: "file",
    title: `Invoice Generated: ${newInv.invoiceNumber}`,
    details: `${newInv.clientName} — KES ${newInv.totalAmount.toLocaleString()} (${newInv.matterTitle})`,
    actorName: "Finance Office",
    time: "Just now"
  });

  try {
    if (db) {
      await setDoc(doc(db, "chambers_invoices", newInv.id), newInv);
    }
  } catch (err) {
    console.warn("Saved invoice locally:", err);
  }

  return newInv;
}

export async function updateInvoiceStatus(id: string, status: "Draft" | "Issued" | "Paid" | "Overdue"): Promise<void> {
  currentInvoices = currentInvoices.map(inv => {
    if (inv.id === id) {
      return { 
        ...inv, 
        status, 
        paidAt: status === "Paid" ? new Date().toISOString().split("T")[0] : inv.paidAt 
      };
    }
    return inv;
  });

  notifyInvoices();

  const target = currentInvoices.find(i => i.id === id);
  if (target && db) {
    try {
      await setDoc(doc(db, "chambers_invoices", id), target);
    } catch (err) {
      console.warn("Updated invoice status locally:", err);
    }
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  currentInvoices = currentInvoices.filter(i => i.id !== id);
  notifyInvoices();

  try {
    if (db) {
      await deleteDoc(doc(db, "chambers_invoices", id));
    }
  } catch (err) {
    console.warn("Deleted invoice locally:", err);
  }
}

// STK PUSH TRANSACTIONS
export function subscribeStkTransactions(cb: Callback<StkPushTransaction>): () => void {
  stkListeners.add(cb);
  cb([...currentTransactions]);
  return () => stkListeners.delete(cb);
}

export async function addStkTransaction(tx: Omit<StkPushTransaction, "id">): Promise<StkPushTransaction> {
  const newTx: StkPushTransaction = {
    ...tx,
    id: `stk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
  };

  currentTransactions = [newTx, ...currentTransactions];
  notifyStk();

  addLog({
    officeId: "all",
    iconType: "check",
    title: `STK Push Payment Received: ${newTx.clientName}`,
    details: `KES ${newTx.amount.toLocaleString()} — Ref: ${newTx.mpesaReceiptNumber || newTx.referenceDoc}`,
    actorName: "M-Pesa STK Gateway",
    time: "Just now"
  });

  try {
    if (db) {
      await setDoc(doc(db, "chambers_stk", newTx.id), newTx);
    }
  } catch (err) {
    console.warn("Saved STK tx locally:", err);
  }

  return newTx;
}
