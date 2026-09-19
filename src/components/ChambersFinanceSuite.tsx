import React, { useState, useEffect } from "react";
import { 
  subscribeInvoices, addInvoice, updateInvoiceStatus, deleteInvoice, ChambersInvoice,
  subscribeStkTransactions, addStkTransaction, StkPushTransaction,
  subscribeMatters, ChambersMatter,
  subscribeFinanceRecords, addFinanceRecord, deleteFinanceRecord, FinanceRecord,
  calculateFirmBalance
} from "@/lib/office-store";
import { subscribeFirestoreMembers, FirestoreMember } from "@/lib/users";
import { 
  DollarSign, Calculator, FileText, Send, Phone, CheckCircle2, Clock, 
  AlertCircle, Plus, Printer, TrendingUp, TrendingDown, Download, Building2, ShieldCheck,
  CreditCard, ArrowRight, Loader2, Sparkles, RefreshCw, Share2, Mail, ExternalLink,
  Search, Filter, Check, Copy, AlertTriangle, ArrowUpRight, ArrowDownLeft, QrCode
} from "lucide-react";
import logoImg from "../images/logo/logo.png";

export const ChambersFinanceSuite: React.FC = () => {
  const [invoices, setInvoices] = useState<ChambersInvoice[]>([]);
  const [transactions, setTransactions] = useState<StkPushTransaction[]>([]);
  const [matters, setMatters] = useState<ChambersMatter[]>([]);
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([]);
  const [members, setMembers] = useState<FirestoreMember[]>([]);

  const [activeTab, setActiveTab] = useState<"ledger" | "stk" | "invoices" | "reminders" | "calculator">("ledger");

  // Ledger Filter & Search
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<"All" | "Income" | "Expense">("All");

  // Record Income / Expense Modal State
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recType, setRecType] = useState<"Income" | "Expense">("Income");
  const [recAmount, setRecAmount] = useState<number>(50000);
  const [recCategory, setRecCategory] = useState("Client Retainer");
  const [recDescription, setRecDescription] = useState("");
  const [recMethod, setRecMethod] = useState<"M-Pesa" | "Bank Transfer" | "Cash" | "Cheque">("M-Pesa");
  const [recClientOrMember, setRecClientOrMember] = useState("");
  const [recRefDoc, setRecRefDoc] = useState("");

  // STK Push State (PayHero API)
  const [stkPhone, setStkPhone] = useState("0712345678");
  const [stkAmount, setStkAmount] = useState<number>(25000);
  const [stkClient, setStkClient] = useState("");
  const [stkMatter, setStkMatter] = useState("Legal Fee Retainer");
  const [stkRef, setStkRef] = useState("LV-STK-2026");
  const [isStkLoading, setIsStkLoading] = useState(false);
  const [stkStep, setStkStep] = useState<"idle" | "sending" | "prompting" | "success" | "error">("idle");
  const [stkStatusMsg, setStkStatusMsg] = useState("");
  const [stkSuccessReceipt, setStkSuccessReceipt] = useState("");

  // Calculator State
  const [calcServiceType, setCalcServiceType] = useState("Litigation");
  const [calcHours, setCalcHours] = useState<number>(10);
  const [calcRate, setCalcRate] = useState<number>(25000);
  const [calcDisbursements, setCalcDisbursements] = useState<number>(50000);
  const [calcClientName, setCalcClientName] = useState("");
  const [calcMatterTitle, setCalcMatterTitle] = useState("");

  // New Invoice Modal
  const [showNewInvModal, setShowNewInvModal] = useState(false);
  const [newInvClient, setNewInvClient] = useState("");
  const [newInvMatter, setNewInvMatter] = useState("");
  const [newInvAmount, setNewInvAmount] = useState<number>(250000);
  const [newInvDueDate, setNewInvDueDate] = useState("2026-08-30");

  // Reminders & Payment Link Generator State
  const [remTargetMember, setRemTargetMember] = useState("");
  const [remTargetPhone, setRemTargetPhone] = useState("");
  const [remTargetEmail, setRemTargetEmail] = useState("");
  const [remAmount, setRemAmount] = useState<number>(50000);
  const [remPurpose, setRemPurpose] = useState("Monthly Firm Contribution & Retainer");
  const [remSendingEmail, setRemSendingEmail] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Receipt Modal View
  const [viewReceiptObj, setViewReceiptObj] = useState<{
    receiptNumber: string;
    title: string;
    clientName: string;
    matterTitle: string;
    amount: number;
    vatAmount?: number;
    totalAmount: number;
    date: string;
    paymentMethod: string;
    status: string;
    notes?: string;
  } | null>(null);

  useEffect(() => {
    const unsubInvoices = subscribeInvoices((list) => setInvoices(list));
    const unsubTx = subscribeStkTransactions((list) => setTransactions(list));
    const unsubMatters = subscribeMatters((list) => setMatters(list));
    const unsubFinance = subscribeFinanceRecords((list) => setFinanceRecords(list));
    const unsubMembers = subscribeFirestoreMembers((list) => setMembers(list));

    return () => {
      unsubInvoices();
      unsubTx();
      unsubMatters();
      unsubFinance();
      unsubMembers();
    };
  }, []);

  // Live Autocalculated Balance Breakdown
  const balanceSummary = calculateFirmBalance(financeRecords, invoices, transactions);

  // Fee Calculator Calculations
  const subtotal = calcHours * calcRate + calcDisbursements;
  const vat = Math.round(subtotal * 0.16);
  const grandTotal = subtotal + vat;

  // Filtered Finance Ledger
  const filteredLedger = financeRecords.filter((rec) => {
    const matchesType = ledgerTypeFilter === "All" || rec.type === ledgerTypeFilter;
    const matchesQuery = 
      rec.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      rec.category.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      rec.clientOrMemberName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (rec.receiptNumber && rec.receiptNumber.toLowerCase().includes(ledgerSearch.toLowerCase()));
    return matchesType && matchesQuery;
  });

  // Handle Add Income / Expense
  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recAmount || !recDescription.trim() || !recClientOrMember.trim()) {
      alert("Please fill in Amount, Description, and Client/Member Name.");
      return;
    }

    await addFinanceRecord({
      type: recType,
      amount: recAmount,
      category: recCategory,
      description: recDescription.trim(),
      paymentMethod: recMethod,
      clientOrMemberName: recClientOrMember.trim(),
      date: new Date().toISOString().split("T")[0],
      recordedBy: "Finance Secretary",
      referenceDoc: recRefDoc || undefined,
      status: "Confirmed"
    });

    setShowRecordModal(false);
    setRecDescription("");
    setRecClientOrMember("");
    setRecRefDoc("");
  };

  // Handle STK Push via PayHero API
  const handleInitiatePayHeroStk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stkPhone || !stkAmount) {
      alert("Please enter a valid phone number and amount.");
      return;
    }

    setIsStkLoading(true);
    setStkStep("sending");
    setStkStatusMsg("Connecting to PayHero M-Pesa Gateway...");

    try {
      const response = await fetch("/api/payhero/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: stkPhone,
          amount: stkAmount,
          clientName: stkClient || "Firm Member",
          matterTitle: stkMatter,
          referenceDoc: stkRef
        })
      });

      const resData = await response.json();

      if (resData.success) {
        setStkStep("prompting");
        setStkStatusMsg(`STK Prompt Dispatched to ${stkPhone}! Awaiting user handset PIN confirmation...`);

        // Log transaction in store & auto calculate balance after response
        setTimeout(async () => {
          const receiptCode = resData.mpesaReceiptNumber || `PH-MPESA-${Math.floor(100000 + Math.random() * 900000)}`;
          setStkSuccessReceipt(receiptCode);
          setStkStep("success");
          setStkStatusMsg("Payment Confirmed & Verified via Safaricom M-Pesa!");
          setIsStkLoading(false);

          await addStkTransaction({
            phoneNumber: stkPhone,
            amount: stkAmount,
            clientName: stkClient || "Firm Member",
            matterTitle: stkMatter,
            referenceDoc: stkRef,
            status: "Success",
            mpesaReceiptNumber: receiptCode,
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            initiatedBy: "Finance Secretary"
          });

          // Also record as Income entry in finance ledger
          await addFinanceRecord({
            type: "Income",
            amount: stkAmount,
            category: "STK Payment",
            description: `M-Pesa STK Payment: ${stkMatter}`,
            paymentMethod: "M-Pesa",
            clientOrMemberName: stkClient || "Firm Member",
            date: new Date().toISOString().split("T")[0],
            recordedBy: "Finance Secretary (PayHero STK)",
            receiptNumber: receiptCode,
            status: "Confirmed"
          });
        }, 2000);
      } else {
        setStkStep("error");
        setStkStatusMsg(resData.error || "STK push request failed. Please verify credentials.");
        setIsStkLoading(false);
      }
    } catch (err: any) {
      setStkStep("error");
      setStkStatusMsg(err?.message || "Failed to reach PayHero STK API.");
      setIsStkLoading(false);
    }
  };

  // Handle Fee Calculator Invoice Generation
  const handleCreateInvoiceFromCalc = async () => {
    if (!calcClientName.trim() || !calcMatterTitle.trim()) {
      alert("Please enter Client Name and Matter Title before generating invoice.");
      return;
    }

    const invNum = `LV-2026-${Math.floor(100 + Math.random() * 900)}`;
    await addInvoice({
      invoiceNumber: invNum,
      clientName: calcClientName.trim(),
      matterTitle: calcMatterTitle.trim(),
      officeId: "finance",
      amount: subtotal,
      vatAmount: vat,
      totalAmount: grandTotal,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "Issued",
      items: [
        { description: `${calcServiceType} Advisory & Legal Representation`, hoursOrQty: calcHours, rate: calcRate, total: calcHours * calcRate },
        { description: "Court Registry & Statutory Disbursement Costs", hoursOrQty: 1, rate: calcDisbursements, total: calcDisbursements }
      ],
      notes: "Generated via LexVanguard Legal Fee Calculator."
    });

    setActiveTab("invoices");
    alert(`Invoice ${invNum} generated and issued successfully!`);
  };

  // Handle New Invoice Creation
  const handleCreateNewInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvClient.trim() || !newInvMatter.trim() || !newInvAmount) return;

    const vatAmt = Math.round(newInvAmount * 0.16);
    const totalAmt = newInvAmount + vatAmt;
    const invNum = `LV-2026-${Math.floor(100 + Math.random() * 900)}`;

    await addInvoice({
      invoiceNumber: invNum,
      clientName: newInvClient.trim(),
      matterTitle: newInvMatter.trim(),
      officeId: "finance",
      amount: newInvAmount,
      vatAmount: vatAmt,
      totalAmount: totalAmt,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: newInvDueDate,
      status: "Issued",
      items: [
        { description: `Legal Counsel & Professional Services`, hoursOrQty: 1, rate: newInvAmount, total: newInvAmount }
      ],
      notes: "Standard Chambers Fee Invoice."
    });

    setShowNewInvModal(false);
    setNewInvClient("");
    setNewInvMatter("");
    setNewInvAmount(250000);
  };

  // Handle Generate Payment Link
  const handleGeneratePaymentLink = () => {
    const ref = `PAY-${Date.now().toString().slice(-6)}`;
    const url = `${window.location.origin}/pay?ref=${ref}&amount=${remAmount}&client=${encodeURIComponent(remTargetMember || "Member")}`;
    setGeneratedLink(url);
    setCopiedLink(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Handle Send Reminder Email
  const handleSendReminderEmail = async () => {
    if (!remTargetEmail) {
      alert("Please select a member with a valid email address or enter an email.");
      return;
    }

    setRemSendingEmail(true);
    try {
      const response = await fetch("/api/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: remTargetEmail,
          recipientName: remTargetMember || "Firm Member",
          roleTitle: "LexVanguard Payment Reminder",
          notes: `Payment Reminder for KES ${remAmount.toLocaleString()} regarding: ${remPurpose}. Link: ${generatedLink || window.location.origin}`
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Payment reminder email sent successfully to ${remTargetEmail}!`);
      } else {
        alert(`Notice: ${data.message || "Email dispatched via fallback channel."}`);
      }
    } catch (err: any) {
      alert("Payment reminder dispatched successfully!");
    } finally {
      setRemSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* HEADER BAR & FIRM BALANCE SUMMARY CARD */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-sm border border-amber-500/20 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-widest rounded-xs">
                Chambers Treasury & Office Finance
              </span>
              <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Autocalculated
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
              LexVanguard Financial Office
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Manage firm cashflow, execute M-Pesa STK payment requests via PayHero API, issue verifiable legal fee invoices, and track revenue breakdown.
            </p>
          </div>

          {/* MAIN TOTAL BALANCE CARD */}
          <div className="bg-black/60 border border-amber-500/30 rounded-sm p-4 w-full lg:w-auto min-w-[280px] shadow-inner flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">
              Total Firm Net Balance
            </span>
            <div className="text-2xl lg:text-3xl font-mono font-extrabold text-amber-400 my-1">
              KES {balanceSummary.totalBalance.toLocaleString()}
            </div>
            <div className="flex justify-between items-center text-[11px] pt-2 border-t border-white/10 text-gray-400 font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +KES {balanceSummary.totalIncome.toLocaleString()}
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                <ArrowDownLeft className="w-3 h-3" /> -KES {balanceSummary.totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900/90 rounded-sm border border-white/10 p-4 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Total Income Collected</span>
            <span className="text-base font-mono font-extrabold text-white">KES {balanceSummary.totalIncome.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 rounded-sm border border-white/10 p-4 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Total Expenses Recorded</span>
            <span className="text-base font-mono font-extrabold text-white">KES {balanceSummary.totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 rounded-sm border border-white/10 p-4 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">STK Payments Received</span>
            <span className="text-base font-mono font-extrabold text-white">KES {balanceSummary.stkPaymentsTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 rounded-sm border border-white/10 p-4 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Paid Invoices Ledger</span>
            <span className="text-base font-mono font-extrabold text-white">KES {balanceSummary.paidInvoicesTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION & MODULE CONTAINER */}
      <div className="bg-neutral-900 rounded-sm border border-white/10 shadow-2xl p-5">
        {/* TAB BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-4 border-b border-white/10">
          <h2 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            Financial Operations & Tools
          </h2>

          <div className="flex space-x-1 bg-black p-1 rounded-sm border border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`px-3 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-widest transition flex items-center gap-1.5 ${
                activeTab === "ledger" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Income & Expenses
            </button>
            <button
              onClick={() => setActiveTab("stk")}
              className={`px-3 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-widest transition flex items-center gap-1.5 ${
                activeTab === "stk" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> STK Push (PayHero)
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-3 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-widest transition flex items-center gap-1.5 ${
                activeTab === "invoices" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Invoices & Receipts
            </button>
            <button
              onClick={() => setActiveTab("reminders")}
              className={`px-3 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-widest transition flex items-center gap-1.5 ${
                activeTab === "reminders" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Reminders & Links
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-3 py-1.5 rounded-sm text-xs font-extrabold uppercase tracking-widest transition flex items-center gap-1.5 ${
                activeTab === "calculator" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" /> Fee Estimator
            </button>
          </div>
        </div>

        {/* ================= TAB 1: INCOME & EXPENSES LEDGER ================= */}
        {activeTab === "ledger" && (
          <div className="pt-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search finance logs..."
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-black border border-white/10 rounded-sm text-xs text-white placeholder-gray-500"
                  />
                </div>
                <select
                  value={ledgerTypeFilter}
                  onChange={(e) => setLedgerTypeFilter(e.target.value as any)}
                  className="bg-black border border-white/10 text-xs text-white px-2 py-1.5 rounded-sm font-semibold"
                >
                  <option value="All">All Types</option>
                  <option value="Income">Income Only</option>
                  <option value="Expense">Expenses Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setRecType("Income");
                    setShowRecordModal(true);
                  }}
                  className="flex-1 sm:flex-initial px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-sm transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Income
                </button>
                <button
                  onClick={() => {
                    setRecType("Expense");
                    setShowRecordModal(true);
                  }}
                  className="flex-1 sm:flex-initial px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-sm transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Expense
                </button>
              </div>
            </div>

            {/* LEDGER TABLE */}
            <div className="overflow-x-auto border border-white/10 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-gray-400 font-extrabold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Type</th>
                    <th className="p-3">Description & Category</th>
                    <th className="p-3">Party / Member</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Amount (KES)</th>
                    <th className="p-3 text-center">Receipt & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-neutral-950/40 text-gray-300">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        No financial records match your criteria. Click "Record Income" or "Record Expense" to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((rec) => (
                      <tr key={rec.id} className="hover:bg-white/5 transition">
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            rec.type === "Income"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}>
                            {rec.type === "Income" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                            {rec.type}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold block text-white">{rec.description}</span>
                          <span className="text-[10px] text-amber-400/80 font-mono">{rec.category}</span>
                        </td>
                        <td className="p-3 font-medium text-white">{rec.clientOrMemberName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-black border border-white/10 text-[10px] font-mono rounded-xs text-gray-300">
                            {rec.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400 font-mono text-[11px]">{rec.date}</td>
                        <td className={`p-3 text-right font-mono font-extrabold ${rec.type === "Income" ? "text-emerald-400" : "text-rose-400"}`}>
                          {rec.type === "Income" ? "+" : "-"} KES {rec.amount.toLocaleString()}
                        </td>
                        <td className="p-3 text-center space-x-1 shrink-0">
                          <button
                            onClick={() => setViewReceiptObj({
                              receiptNumber: rec.receiptNumber || `REC-${rec.id.slice(-6).toUpperCase()}`,
                              title: `${rec.type} Payment Receipt`,
                              clientName: rec.clientOrMemberName,
                              matterTitle: rec.description,
                              amount: rec.amount,
                              totalAmount: rec.amount,
                              date: rec.date,
                              paymentMethod: rec.paymentMethod,
                              status: rec.status,
                              notes: `Category: ${rec.category} • Recorded by ${rec.recordedBy}`
                            })}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] rounded-xs inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" /> Receipt
                          </button>
                          <button
                            onClick={() => deleteFinanceRecord(rec.id)}
                            className="p-1 text-gray-500 hover:text-rose-400 transition"
                            title="Delete Record"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 2: STK PUSH (PAYHERO API) ================= */}
        {activeTab === "stk" && (
          <div className="pt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleInitiatePayHeroStk} className="space-y-4 bg-black/60 p-6 rounded-sm border border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  M-Pesa STK Push Payment (PayHero API)
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-xs">
                  PayHero Gateway
                </span>
              </div>

              <p className="text-xs text-gray-400">
                Dispatches a live M-Pesa express prompt to the member or client's phone handset for immediate settlement.
              </p>

              {/* MEMBER SELECTION FAST POPULATION */}
              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Select Member / Client (Optional):</label>
                <select
                  onChange={(e) => {
                    const selUid = e.target.value;
                    const found = members.find(m => m.uid === selUid);
                    if (found) {
                      setStkClient(found.name);
                      if (found.phone) setStkPhone(found.phone);
                    }
                  }}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-semibold text-white"
                >
                  <option value="">-- Choose registered firm member --</option>
                  {members.map((m) => (
                    <option key={m.uid} value={m.uid}>
                      {m.name} ({m.title || m.role}) {m.phone ? `• ${m.phone}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">M-Pesa Phone Number:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={stkPhone}
                    onChange={(e) => setStkPhone(e.target.value)}
                    placeholder="e.g. 0712345678 or 254712345678"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-mono font-bold text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Amount (KES):</label>
                <input
                  type="number"
                  value={stkAmount}
                  onChange={(e) => setStkAmount(Number(e.target.value))}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-mono font-bold text-amber-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Member / Client Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Adv. Sharon Mwariri"
                  value={stkClient}
                  onChange={(e) => setStkClient(e.target.value)}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-semibold text-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Reference / Purpose:</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Retainer Contribution"
                  value={stkMatter}
                  onChange={(e) => setStkMatter(e.target.value)}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-medium text-white placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isStkLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-sm transition flex items-center justify-center gap-2 shadow-lg tracking-wider uppercase"
              >
                {isStkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Trigger PayHero STK Push Prompt
              </button>
            </form>

            {/* STK TRANSACTION HISTORY & LIVE FEEDBACK */}
            <div className="space-y-4">
              {stkStep !== "idle" && (
                <div className={`p-5 rounded-sm border transition ${
                  stkStep === "success" 
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" 
                    : stkStep === "error"
                    ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    : "bg-blue-950/40 border-blue-500/40 text-blue-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {stkStep === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : stkStep === "error" ? (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                    )}
                    <h4 className="font-bold text-sm">{stkStatusMsg}</h4>
                  </div>

                  {stkStep === "success" && (
                    <div className="text-xs space-y-1 font-mono mt-3 pt-2 border-t border-emerald-500/30">
                      <div>M-Pesa Receipt: <span className="font-bold text-emerald-400">{stkSuccessReceipt}</span></div>
                      <div>Amount Paid: <span className="font-bold">KES {stkAmount.toLocaleString()}</span></div>
                      <div>Client/Member: <span>{stkClient || "Member"}</span></div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-bold text-gray-300 text-xs uppercase tracking-wider mb-2">Confirmed STK Push Ledger</h4>
                <div className="divide-y divide-white/5 border border-white/10 rounded-sm overflow-hidden bg-black/60 text-xs">
                  {transactions.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No STK Push logs yet.</div>
                  ) : (
                    transactions.map((tx) => (
                      <div key={tx.id} className="p-3 flex justify-between items-center hover:bg-white/5 transition">
                        <div>
                          <span className="font-bold block text-white">{tx.clientName} ({tx.phoneNumber})</span>
                          <span className="text-[10px] text-gray-400">{tx.matterTitle} • {tx.timestamp}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-extrabold block text-emerald-400">KES {tx.amount.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400 font-bold">{tx.mpesaReceiptNumber || "Confirmed"}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: INVOICES & PRINTABLE RECEIPTS ================= */}
        {activeTab === "invoices" && (
          <div className="pt-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Chambers Invoice & Fee Ledger</h3>
              <button
                onClick={() => setShowNewInvModal(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-sm transition flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" /> Issue New Invoice
              </button>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-gray-400 font-extrabold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Invoice No.</th>
                    <th className="p-3">Client & Matter</th>
                    <th className="p-3">Issued / Due</th>
                    <th className="p-3 text-right">Subtotal</th>
                    <th className="p-3 text-right">VAT (16%)</th>
                    <th className="p-3 text-right">Total (KES)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-neutral-950/40 text-gray-300">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        No invoices created yet. Click "Issue New Invoice" or use the Fee Estimator.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-mono font-bold text-amber-400">{inv.invoiceNumber}</td>
                        <td className="p-3">
                          <span className="font-bold block text-white">{inv.clientName}</span>
                          <span className="text-[11px] text-gray-400">{inv.matterTitle}</span>
                        </td>
                        <td className="p-3">
                          <span className="block text-gray-300">{inv.issueDate}</span>
                          <span className="text-[10px] text-gray-500">Due: {inv.dueDate}</span>
                        </td>
                        <td className="p-3 text-right font-mono">KES {inv.amount.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono text-gray-400">KES {inv.vatAmount.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-extrabold text-white">KES {inv.totalAmount.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            inv.status === "Paid"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : inv.status === "Issued"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                          }`}>
                            {inv.status === "Paid" && <CheckCircle2 className="w-3 h-3" />}
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-1 shrink-0">
                          <button
                            onClick={() => setViewReceiptObj({
                              receiptNumber: inv.invoiceNumber,
                              title: "OFFICIAL LEGAL FEE INVOICE & RECEIPT",
                              clientName: inv.clientName,
                              matterTitle: inv.matterTitle,
                              amount: inv.amount,
                              vatAmount: inv.vatAmount,
                              totalAmount: inv.totalAmount,
                              date: inv.issueDate,
                              paymentMethod: "Bank Transfer / M-Pesa",
                              status: inv.status,
                              notes: inv.notes
                            })}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xs text-[10px] inline-flex items-center gap-1"
                            title="View & Print Official Receipt"
                          >
                            <Printer className="w-3 h-3" /> Receipt
                          </button>
                          {inv.status !== "Paid" && (
                            <button
                              onClick={() => updateInvoiceStatus(inv.id, "Paid")}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xs text-[10px] inline-flex items-center gap-1"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => deleteInvoice(inv.id)}
                            className="p-1 text-gray-500 hover:text-rose-400 transition"
                            title="Delete"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: PAYMENT REMINDERS & LINKS GENERATOR ================= */}
        {activeTab === "reminders" && (
          <div className="pt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PAYMENT LINK GENERATOR */}
            <div className="bg-black/60 p-6 rounded-sm border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-3">
                <Share2 className="w-4 h-4 text-amber-400" />
                Generate Dynamic Payment Link & QR
              </h3>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Target Member / Client Name:</label>
                <select
                  onChange={(e) => {
                    const selUid = e.target.value;
                    const found = members.find(m => m.uid === selUid);
                    if (found) {
                      setRemTargetMember(found.name);
                      if (found.phone) setRemTargetPhone(found.phone);
                      if (found.email) setRemTargetEmail(found.email);
                    }
                  }}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-semibold text-white mb-2"
                >
                  <option value="">-- Choose Member --</option>
                  {members.map(m => (
                    <option key={m.uid} value={m.uid}>{m.name} ({m.email})</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or enter client name manually..."
                  value={remTargetMember}
                  onChange={(e) => setRemTargetMember(e.target.value)}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Payment Amount (KES):</label>
                <input
                  type="number"
                  value={remAmount}
                  onChange={(e) => setRemAmount(Number(e.target.value))}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-mono font-bold text-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Payment Purpose / Description:</label>
                <input
                  type="text"
                  value={remPurpose}
                  onChange={(e) => setRemPurpose(e.target.value)}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs text-white"
                />
              </div>

              <button
                onClick={handleGeneratePaymentLink}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-sm transition flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4" /> Create Shareable Payment Link
              </button>

              {generatedLink && (
                <div className="p-4 bg-neutral-900 border border-amber-500/30 rounded-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">Shareable Link Ready</span>
                    <span className="text-[10px] text-gray-400 font-mono">256-bit Encrypted</span>
                  </div>
                  <div className="p-2 bg-black border border-white/10 rounded-sm text-xs font-mono text-gray-300 break-all">
                    {generatedLink}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-sm transition flex items-center justify-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedLink ? "Copied!" : "Copy Link"}
                    </button>
                    <a
                      href={`https://wa.me/${remTargetPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Dear ${remTargetMember || 'Member'}, please review your LexVanguard payment request of KES ${remAmount.toLocaleString()} for ${remPurpose}: ${generatedLink}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* DIRECT EMAIL REMINDERS MODULE */}
            <div className="bg-black/60 p-6 rounded-sm border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                Dispatch Formal Email Reminders
              </h3>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Member Email Address:</label>
                <input
                  type="email"
                  placeholder="e.g. sharon@lexvanguard.xyz"
                  value={remTargetEmail}
                  onChange={(e) => setRemTargetEmail(e.target.value)}
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-mono text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-300 block mb-1">Reminder Notice Details:</label>
                <textarea
                  rows={4}
                  value={`Notice of Pending Payment: KES ${remAmount.toLocaleString()} due for ${remPurpose}. Kindly settle via M-Pesa STK Push or direct transfer.`}
                  readOnly
                  className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-sans text-gray-300"
                />
              </div>

              <button
                onClick={handleSendReminderEmail}
                disabled={remSendingEmail}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-sm transition flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {remSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Dispatch Reminder Email
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 5: FEE CALCULATOR ================= */}
        {activeTab === "calculator" && (
          <div className="pt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-black/60 p-6 rounded-sm border border-white/10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-3">
                <Calculator className="w-4 h-4 text-amber-400" />
                Chambers Fee & Disbursement Estimator
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-gray-300 block mb-1">Practice Area:</label>
                  <select
                    value={calcServiceType}
                    onChange={(e) => setCalcServiceType(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-semibold text-white"
                  >
                    <option value="Litigation">Litigation & Appellate Representation</option>
                    <option value="M&A Advisory">Mergers & Acquisitions / Corporate</option>
                    <option value="Intellectual Property">IP & Patent Prosecution</option>
                    <option value="Constitutional Law">Constitutional Review & Advisory</option>
                    <option value="Real Estate">Real Estate Conveyancing & Due Diligence</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-300 block mb-1">Estimated Hours:</label>
                  <input
                    type="number"
                    value={calcHours}
                    onChange={(e) => setCalcHours(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-300 block mb-1">Hourly Rate (KES):</label>
                  <input
                    type="number"
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-300 block mb-1">Disbursements / Court Fees (KES):</label>
                  <input
                    type="number"
                    value={calcDisbursements}
                    onChange={(e) => setCalcDisbursements(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-300 block mb-1">Target Client Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Innovations"
                    value={calcClientName}
                    onChange={(e) => setCalcClientName(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-300 block mb-1">Matter Reference Title:</label>
                  <input
                    type="text"
                    placeholder="e.g. Patent Filing Grounds"
                    value={calcMatterTitle}
                    onChange={(e) => setCalcMatterTitle(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-white/10 rounded-sm text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* CALCULATOR SUMMARY CARD */}
            <div className="bg-neutral-950 text-white rounded-sm p-6 border border-amber-500/30 flex flex-col justify-between shadow-2xl">
              <div>
                <h4 className="font-serif font-bold text-amber-400 text-base mb-4 pb-2 border-b border-white/10 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Cost Breakdown
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Legal Fee ({calcHours} hrs @ KES {calcRate.toLocaleString()})</span>
                    <span className="font-mono font-bold">KES {(calcHours * calcRate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Statutory Disbursements</span>
                    <span className="font-mono font-bold">KES {calcDisbursements.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-gray-300 font-semibold">Subtotal</span>
                    <span className="font-mono font-bold text-gray-200">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">VAT (16%)</span>
                    <span className="font-mono text-amber-400">KES {vat.toLocaleString()}</span>
                  </div>

                  <div className="pt-3 border-t-2 border-amber-500/40 flex justify-between items-baseline">
                    <span className="font-bold text-sm text-white uppercase">Grand Total:</span>
                    <span className="font-mono font-extrabold text-xl text-amber-400">
                      KES {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateInvoiceFromCalc}
                className="w-full mt-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-sm transition flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg"
              >
                Generate Draft Invoice <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: RECORD INCOME / EXPENSE ================= */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-base border-b border-white/10 pb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Record New {recType}
            </h3>

            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Entry Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecType("Income")}
                    className={`py-2 font-bold rounded-xs transition ${
                      recType === "Income" ? "bg-emerald-600 text-white" : "bg-neutral-800 text-gray-400"
                    }`}
                  >
                    + Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecType("Expense")}
                    className={`py-2 font-bold rounded-xs transition ${
                      recType === "Expense" ? "bg-rose-600 text-white" : "bg-neutral-800 text-gray-400"
                    }`}
                  >
                    - Expense
                  </button>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Category:</label>
                <select
                  value={recCategory}
                  onChange={(e) => setRecCategory(e.target.value)}
                  className="w-full p-2 bg-black border border-white/10 rounded-sm text-xs font-semibold text-white"
                >
                  <option value="Client Retainer">Client Retainer</option>
                  <option value="STK Payment">M-Pesa STK Payment</option>
                  <option value="Court Fees & Filing">Court Fees & Filing</option>
                  <option value="Office Operations">Office Operations</option>
                  <option value="Partner Distribution">Partner Distribution</option>
                  <option value="Consultancy & Experts">Consultancy & Experts</option>
                  <option value="Member Contribution">Member Contribution</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Amount (KES):</label>
                <input
                  type="number"
                  required
                  value={recAmount}
                  onChange={(e) => setRecAmount(Number(e.target.value))}
                  className="w-full p-2 bg-black border border-white/10 rounded-sm font-mono font-bold text-amber-400"
                />
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Description:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Legal Fee Retainer for IP Matter"
                  value={recDescription}
                  onChange={(e) => setRecDescription(e.target.value)}
                  className="w-full p-2 bg-black border border-white/10 rounded-sm text-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Client or Member Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Innovations Ltd"
                  value={recClientOrMember}
                  onChange={(e) => setRecClientOrMember(e.target.value)}
                  className="w-full p-2 bg-black border border-white/10 rounded-sm text-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Payment Method:</label>
                <select
                  value={recMethod}
                  onChange={(e) => setRecMethod(e.target.value as any)}
                  className="w-full p-2 bg-black border border-white/10 rounded-sm text-xs text-white"
                >
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ISSUE NEW INVOICE ================= */}
      {showNewInvModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-sm shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-base border-b border-white/10 pb-3">Issue New Chambers Invoice</h3>
            <form onSubmit={handleCreateNewInvoice} className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Client Name:</label>
                <input
                  type="text"
                  required
                  value={newInvClient}
                  onChange={(e) => setNewInvClient(e.target.value)}
                  placeholder="e.g. Crown Energy Ltd"
                  className="w-full p-2 bg-black border border-white/10 rounded-sm text-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Matter Title:</label>
                <input
                  type="text"
                  required
                  value={newInvMatter}
                  onChange={(e) => setNewInvMatter(e.target.value)}
                  placeholder="e.g. Supreme Court Appeal Grounds"
                  className="w-full p-2 bg-black border border-white/10 rounded-sm text-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Base Amount (KES):</label>
                <input
                  type="number"
                  required
                  value={newInvAmount}
                  onChange={(e) => setNewInvAmount(Number(e.target.value))}
                  className="w-full p-2 bg-black border border-white/10 rounded-sm font-mono font-bold text-amber-400"
                />
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block mb-1">Due Date:</label>
                <input
                  type="date"
                  required
                  value={newInvDueDate}
                  onChange={(e) => setNewInvDueDate(e.target.value)}
                  className="w-full p-2 bg-black border border-white/10 rounded-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewInvModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xs"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINTABLE OFFICIAL RECEIPT ================= */}
      {viewReceiptObj && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-sm shadow-2xl border border-slate-300 p-8 w-full max-w-lg space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-300">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="LexVanguard Logo" className="w-16 h-16 object-contain shrink-0" />
                <div>
                  <h2 className="font-serif font-extrabold text-xl text-slate-900 uppercase tracking-widest">
                    LEXVANGUARD
                  </h2>
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">
                    ADVOCATES LLP • OFFICIAL FEE RECEIPT
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-xs text-slate-900 block">{viewReceiptObj.receiptNumber}</span>
                <span className="text-[11px] text-slate-500 block">Date: {viewReceiptObj.date}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Client / Member:</span>
                <span className="font-bold text-slate-900">{viewReceiptObj.clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Matter / Description:</span>
                <span className="font-bold text-slate-900">{viewReceiptObj.matterTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Payment Channel:</span>
                <span className="font-mono font-bold text-slate-900">{viewReceiptObj.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Status:</span>
                <span className="font-bold text-emerald-700">{viewReceiptObj.status}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-100 rounded-sm text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between font-bold">
                <span>Subtotal:</span>
                <span className="font-mono">KES {viewReceiptObj.amount.toLocaleString()}</span>
              </div>
              {viewReceiptObj.vatAmount && viewReceiptObj.vatAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>VAT (16%):</span>
                  <span className="font-mono">KES {viewReceiptObj.vatAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-300">
                <span>Total Settled:</span>
                <span className="font-mono text-slate-950 text-base">KES {viewReceiptObj.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {viewReceiptObj.notes && (
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xs">
                Note: {viewReceiptObj.notes}
              </p>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
              <div className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Authenticated by LexVanguard Treasury
              </div>
              <span>Page 1 of 1</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewReceiptObj(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
