import React, { useState, useRef, useEffect } from "react";
import { 
  LayoutGrid, Scale, Folder, MessageSquare, FileText, ArrowLeft,
  Sparkles, Plus, Trash2, ArrowRight, AlignLeft, Files,
  Eye, Copy, FolderPlus, Search, ChevronDown,
  Paperclip, Send, X, Download, Check, Upload, FileUp, Cpu, ShieldCheck
} from "lucide-react";

export interface CaseItem {
  id: string;
  title: string;
  referenceNo?: string;
  practiceArea?: string;
  facts?: string;
  progress?: string;
  status: 'Active' | 'Pending' | 'In Court' | 'Closed' | string;
  lastUpdated: string;
}

export interface DocumentItem {
  id: string;
  caseId?: string;
  caseTitle?: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'IMAGE' | 'TXT' | 'Authority' | string;
  date: string;
  size?: string;
  citation?: string;
  sourceUrl?: string;
  pdfUrl?: string;
  excerpt?: string;
  extractedText?: string;
  fileDataUrl?: string;
  isSavedAuthority?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
  attachedMaterials?: string[];
  isError?: boolean;
}

export interface ElegalSearchResult {
  title: string;
  citation: string;
  url: string;
  type: 'precedent' | 'statute' | string;
  source: 'kenya' | 'international' | string;
  score?: number;
  excerpt: string;
}

export const extractPdfTextFromBuffer = (buffer: ArrayBuffer): string => {
  try {
    const bytes = new Uint8Array(buffer);
    const decoder = new TextDecoder("latin1");
    const rawString = decoder.decode(bytes);

    const textPieces: string[] = [];
    const matches = rawString.match(/\(([^()]{3,})\)/g);
    if (matches && matches.length > 0) {
      for (const m of matches) {
        const cleaned = m.slice(1, -1).replace(/\\([0-7]{1,3})/g, '').replace(/\\/g, '').trim();
        if (cleaned.length > 2 && /[a-zA-Z0-9]/.test(cleaned) && !/^\d+[\s\d]*$/.test(cleaned)) {
          textPieces.push(cleaned);
        }
      }
    }

    if (textPieces.length > 5) {
      return textPieces.join(" ");
    }

    const lines = rawString.split(/[\r\n]+/);
    const validLines: string[] = [];
    for (const line of lines) {
      const trimmed = line.replace(/[^\x20-\x7E]/g, ' ').trim();
      if (trimmed.length > 15 && /[a-zA-Z]{3,}/.test(trimmed) && !/obj|endobj|stream|endstream|xref|trailer|Filter|Length/i.test(trimmed)) {
        validLines.push(trimmed);
      }
    }

    if (validLines.length > 0) {
      return validLines.join("\n");
    }

    return textPieces.join(" ") || "";
  } catch (e) {
    console.warn("PDF text extraction notice:", e);
    return "";
  }
};

interface ResearchCoHelperProps {
  currentOfficeId?: string;
  userName?: string;
  activeMatterId?: string;
  onClose?: () => void;
}

export const ResearchCoHelper: React.FC<ResearchCoHelperProps> = ({
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'search' | 'materials' | 'ai' | 'drafting'>('cases');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [isCaseDetailOpen, setIsCaseDetailOpen] = useState(false);

  // Cases state (persisted in localStorage)
  const [cases, setCases] = useState<CaseItem[]>(() => {
    try {
      const saved = localStorage.getItem("lexvanguard_user_cases");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn("Failed to parse saved cases:", e);
    }
    return [];
  });

  // Materials / Documents state (persisted in localStorage)
  const [mockDocuments, setMockDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem("lexvanguard_materials");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse saved materials:", e);
    }
    return [];
  });

  // Toast / Feedback notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Save cases to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lexvanguard_user_cases", JSON.stringify(cases));
    } catch (e) {
      console.error("Error saving cases to localStorage", e);
    }
  }, [cases]);

  // Save materials metadata to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lexvanguard_materials", JSON.stringify(mockDocuments));
    } catch (e) {
      console.error("Error saving materials to localStorage", e);
    }
  }, [mockDocuments]);

  // New case form state
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseRef, setNewCaseRef] = useState("");
  const [newCaseArea, setNewCaseArea] = useState("Appellate");
  const [newCaseFacts, setNewCaseFacts] = useState("");

  // Research Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Greetings Counsel. I am your LexAI Assistant powered by Gemini & eLegal search grounding. I can analyze case files, cite statutes (Laws of Kenya), query judicial precedents, and synthesize uploaded materials. How may I assist your research today?' 
    }
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [attachedDocs, setAttachedDocs] = useState<DocumentItem[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Drafting State (Groq Llama-3.3-70B + Gemini Fallback)
  const [submissionType, setSubmissionType] = useState("Formal Skeleton Argument");
  const [courtForum, setCourtForum] = useState("High Court of Kenya");
  const [wordCountTarget, setWordCountTarget] = useState<number>(5000);
  const [clientNameInput, setClientNameInput] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [draftEngineUsed, setDraftEngineUsed] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  // Document Reader & AI Summarizer State
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [isPDFReaderOpen, setIsPDFReaderOpen] = useState(false);
  const [analyzingDoc, setAnalyzingDoc] = useState<DocumentItem | null>(null);
  const [docAnalysisSummary, setDocAnalysisSummary] = useState<string | null>(null);
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);

  // eLegal Direct Search State
  const [eLegalQuery, setELegalQuery] = useState("constitution land rights");
  const [eLegalSourceFilter, setELegalSourceFilter] = useState<"all" | "precedent" | "statute">("all");
  const [eLegalResults, setELegalResults] = useState<ElegalSearchResult[]>([]);
  const [isELegalLoading, setIsELegalLoading] = useState(false);
  const [copiedCitationIndex, setCopiedCitationIndex] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  // Restore cached eLegal search results from LocalStorage on component mount
  useEffect(() => {
    try {
      const cachedLast = localStorage.getItem("lex_elegal_last_results");
      const cachedQuery = localStorage.getItem("lex_elegal_last_query");
      if (cachedLast) {
        const parsed = JSON.parse(cachedLast);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setELegalResults(parsed);
        }
      }
      if (cachedQuery) {
        setELegalQuery(cachedQuery);
      }
    } catch (e) {
      console.warn("eLegal cache restore notice:", e);
    }
  }, []);

  // Execute eLegal Corpus Search with LocalStorage caching
  const runELegalSearch = async (queryText: string, sourceFilter: string) => {
    if (!queryText.trim()) {
      setELegalResults([]);
      return;
    }

    const cacheKey = `lex_elegal_query_${queryText.trim().toLowerCase()}_${sourceFilter}`;
    
    // Check LocalStorage cache first for instant retrieval
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setELegalResults(parsed);
        }
      }
    } catch {}

    setIsELegalLoading(true);
    try {
      const res = await fetch(`/api/elegal/search?q=${encodeURIComponent(queryText)}&source=${encodeURIComponent(sourceFilter)}`);
      if (res.ok) {
        const data = await res.json();
        const resultsArray = Array.isArray(data) ? data : [];
        setELegalResults(resultsArray);

        // Cache search results in LocalStorage
        try {
          localStorage.setItem(cacheKey, JSON.stringify(resultsArray));
          localStorage.setItem("lex_elegal_last_results", JSON.stringify(resultsArray));
          localStorage.setItem("lex_elegal_last_query", queryText.trim());
        } catch {}
      }
    } catch (err) {
      console.error("eLegal Search Error:", err);
    } finally {
      setIsELegalLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
      
      if (isPdf) {
        const readerData = new FileReader();
        readerData.onload = (evtData) => {
          const dataUrl = evtData.target?.result as string || "";

          const readerBuf = new FileReader();
          readerBuf.onload = (evtBuf) => {
            const buffer = evtBuf.target?.result as ArrayBuffer;
            let textContent = extractPdfTextFromBuffer(buffer);
            if (!textContent || textContent.length < 10) {
              textContent = `PDF Document Title: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB`;
            }

            const newDoc: DocumentItem = {
              id: `doc_upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              caseId: selectedCase?.id,
              caseTitle: selectedCase?.title,
              name: file.name,
              type: 'PDF',
              date: new Date().toISOString().split('T')[0],
              size: `${(file.size / 1024).toFixed(1)} KB`,
              excerpt: textContent.substring(0, 300),
              extractedText: textContent,
              fileDataUrl: dataUrl,
              pdfUrl: dataUrl
            };

            setMockDocuments(prev => [newDoc, ...prev]);
            setAttachedDocs(prev => [...prev, newDoc]);
            showToast(`Uploaded & extracted text from "${file.name}"!`);
          };
          readerBuf.readAsArrayBuffer(file);
        };
        readerData.readAsDataURL(file);
      } else {
        const readerText = new FileReader();
        readerText.onload = (evtText) => {
          const content = evtText.target?.result as string || "";
          const extension = file.name.split('.').pop()?.toUpperCase() || 'TXT';

          const newDoc: DocumentItem = {
            id: `doc_upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            caseId: selectedCase?.id,
            caseTitle: selectedCase?.title,
            name: file.name,
            type: extension === 'DOCX' || extension === 'DOC' ? 'DOCX' : 'TXT',
            date: new Date().toISOString().split('T')[0],
            size: `${(file.size / 1024).toFixed(1)} KB`,
            excerpt: content.substring(0, 300) || `Uploaded file: ${file.name}`,
            extractedText: content,
            fileDataUrl: content
          };

          setMockDocuments(prev => [newDoc, ...prev]);
          setAttachedDocs(prev => [...prev, newDoc]);
          showToast(`Uploaded "${file.name}"!`);
        };
        readerText.readAsText(file);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim()) return;

    const newCase: CaseItem = {
      id: `case_${Date.now()}`,
      title: newCaseTitle.trim(),
      referenceNo: newCaseRef.trim() || `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
      practiceArea: newCaseArea,
      facts: newCaseFacts.trim() || "Case file opened for active legal research.",
      progress: "Initial scoping",
      status: "Active",
      lastUpdated: new Date().toISOString().split("T")[0]
    };

    setCases(prev => [newCase, ...prev]);
    showToast("New case file created!");
    setNewCaseTitle("");
    setNewCaseRef("");
    setNewCaseFacts("");
    setIsCreatingCase(false);
  };

  const handleDeleteCase = (id: string) => {
    if (confirm("Are you sure you want to remove this case workspace?")) {
      setCases(prev => prev.filter(c => c.id !== id));
      if (selectedCase?.id === id) {
        setSelectedCase(null);
        setIsCaseDetailOpen(false);
      }
      showToast("Case removed.");
    }
  };

  const openPDFReader = (doc: DocumentItem) => {
    setViewingDoc(doc);
    setIsPDFReaderOpen(true);
  };

  const handleAnalyzeDocument = async (doc: DocumentItem) => {
    setAnalyzingDoc(doc);
    setIsAnalyzingDoc(true);
    setDocAnalysisSummary(null);

    let docText = doc.fileDataUrl || doc.extractedText || doc.excerpt || "";

    // Internal text extraction: fetch plain text content if document is remote or needs extraction
    if ((!docText || docText.length < 50) && doc.sourceUrl) {
      try {
        const fetchRes = await fetch(`/api/elegal/document-content?sourceUrl=${encodeURIComponent(doc.sourceUrl)}`);
        if (fetchRes.ok) {
          const fetchJson = await fetchRes.json();
          if (fetchJson.plainText) {
            docText = fetchJson.plainText;
          }
        }
      } catch (e) {
        console.warn("Text extraction fetch notice:", e);
      }
    }

    const docCategory = doc.type === 'statute' || /\b(act|statute|legislation|cap|bill|code)\b/i.test(doc.name) ? 'statute' : 'precedent';

    try {
      const res = await fetch("/api/research/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentTitle: doc.name,
          documentContent: docText,
          matterTitle: selectedCase?.title || doc.caseTitle || "Legal Material",
          docCategory
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          setDocAnalysisSummary(data.analysis);
          return;
        }
      }

      // Direct Groq API Client-Side Fallback if proxy endpoint returns error
      const groqKey = import.meta.env.VITE_GROQ_API_KEY;
      if (groqKey) {
        const isStatute = docCategory === 'statute';
        const systemPrompt = isStatute
          ? `You are Senior Legal Analyst at LexVanguard Chambers. Extract and summarize strictly from the provided text using: 1. Long Title, 2. Short Title, 3. Preamble, 4. Enacting Clause, 5. Definitions / Interpretation Section, 6. Sections and Subsections, 7. Provisos. STRICT NON-HALLUCINATION: If a section is missing from text, state "Not stated in provided document text."`
          : `You are Senior Legal Analyst at LexVanguard Chambers. Extract and summarize strictly from the provided text using: 1. Case Name and Citation, 2. Procedural History, 3. Material Facts, 4. Legal Issues, 5. Rule of Law, 6. Court Reasoning (Ratio Decidendi), 7. Holding / Judgment, 8. Side Remarks (Obiter Dictum). STRICT NON-HALLUCINATION: If a section is missing from text, state "Not stated in provided document text."`;

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Document Title: ${doc.name}\nMatter: ${selectedCase?.title || doc.caseTitle || "Legal Material"}\nText:\n${docText}` }
            ],
            temperature: 0.1
          })
        });

        if (groqRes.ok) {
          const gData = await groqRes.json();
          const gText = gData.choices?.[0]?.message?.content;
          if (gText) {
            setDocAnalysisSummary(gText);
            return;
          }
        }
      }

      setDocAnalysisSummary("Failed to generate document analysis summary.");
    } catch (err) {
      setDocAnalysisSummary("Error contacting document analysis API engine.");
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  const handleSaveResultToMaterials = (result: ElegalSearchResult) => {
    const existing = mockDocuments.find(d => d.citation === result.citation || d.name === result.title);
    if (existing) {
      showToast("Resource already in Materials library!");
      return;
    }

    const newMat: DocumentItem = {
      id: `mat_elegal_${Date.now()}`,
      caseId: selectedCase?.id,
      caseTitle: selectedCase?.title,
      name: `${result.title.substring(0, 35)}.pdf`,
      type: result.type === 'statute' ? 'TXT' : 'PDF',
      date: new Date().toISOString().split('T')[0],
      size: '1.9 MB',
      citation: result.citation,
      sourceUrl: result.url,
      excerpt: result.excerpt,
      extractedText: `CITATION: ${result.citation}\nTITLE: ${result.title}\n\n${result.excerpt}`
    };

    setMockDocuments(prev => [newMat, ...prev]);
    showToast(`Saved "${result.title.substring(0, 25)}..." to Materials!`);
  };

  const handleCopyCitation = (citation: string, index: number) => {
    if (!citation) return;
    navigator.clipboard.writeText(citation);
    setCopiedCitationIndex(index);
    showToast("Citation copied!");
    setTimeout(() => setCopiedCitationIndex(null), 2000);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInputText.trim();
    if ((!text && attachedDocs.length === 0) || isChatLoading) return;

    let extractedContexts = "";
    const attachedDocNames = attachedDocs.map(d => d.name);

    if (attachedDocs.length > 0) {
      extractedContexts = attachedDocs.map(d => `--- MATERIAL: ${d.name} ---\n${d.extractedText || d.excerpt || ''}`).join("\n\n");
    }

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: text || "Analyze attached legal documents and authorities.",
      attachedMaterials: attachedDocNames.length > 0 ? attachedDocNames : undefined
    };
    setChatMessages(prev => [...prev, userMsg]);

    setChatInputText("");
    setAttachedDocs([]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/lexai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text || "Analyze attached legal documents and authorities.",
          matterTitle: selectedCase?.title || "Legal Research Query",
          caseContext: extractedContexts || selectedCase?.facts || ""
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      if (data.answer) {
        setChatMessages(prev => [...prev, {
          role: 'model',
          text: data.answer,
          sources: data.sources || []
        }]);
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      console.error("AI Research Error:", err);
      setChatMessages(prev => [...prev, {
        role: 'model',
        text: `Based on Laws of Kenya and relevant judicial authorities regarding your query:\n\n1. Ensure pleadings comply with statutory procedural requirements under the Civil Procedure Rules.\n2. Review supporting affidavits and exhibit materials.`
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!draftNotes.trim() || isDrafting) return;
    setIsDrafting(true);

    try {
      const response = await fetch("/api/research/draft-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionType,
          courtForum,
          wordCountTarget,
          matterTitle: selectedCase?.title || "Legal Matter",
          clientName: clientNameInput || selectedCase?.referenceNo || "The Applicant",
          facts: draftNotes,
          researchNotes: draftNotes
        })
      });

      if (!response.ok) throw new Error("Drafting failed");
      const data = await response.json();
      if (data.draft) {
        setDraftOutput(data.draft);
        if (data.engineUsed) setDraftEngineUsed(data.engineUsed);
        showToast(`Draft generated via ${data.engineUsed || 'Groq Llama-3.3-70B'}!`);
      }
    } catch (err) {
      setDraftOutput(`IN THE ${courtForum.toUpperCase()}\n\nMATTER: ${selectedCase?.title || 'LEGAL MATTER'}\n\n1. STATEMENT OF FACTS:\n${draftNotes}\n\n2. LEGAL SUBMISSIONS:\nIn accordance with Constitutional and statutory provisions under Laws of Kenya.`);
    } finally {
      setIsDrafting(false);
    }
  };

  // Word count & Character count helper
  const outputWordCount = draftOutput ? draftOutput.trim().split(/\s+/).filter(Boolean).length : 0;
  const outputCharCount = draftOutput ? draftOutput.length : 0;

  return (
    <div className="w-full h-full min-h-screen flex flex-col font-sans selection:bg-[#0071e3] selection:text-white bg-white text-[#1d1d1f] relative overflow-hidden">
      
      {/* Hidden File Input for Real Material Uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        multiple 
        className="hidden" 
        accept=".pdf,.docx,.doc,.txt,image/*" 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#1d1d1f] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-black/10 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="w-full px-6 py-3 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Branding & Back Button */}
        <div className="flex items-center gap-3">
          {onClose ? (
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors text-zinc-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 font-bold" />
            </button>
          ) : (
            <button 
              onClick={() => window.location.href='/office'} 
              className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors text-zinc-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 font-bold" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1d1d1f] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-bold text-zinc-900 tracking-tight text-sm">Research Intelligence</span>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="flex bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/60 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cases' ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Cases
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'search' ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> eLegal Search
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'materials' ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Folder className="w-3.5 h-3.5" /> Materials
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ai' ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Research AI
          </button>
          <button
            onClick={() => setActiveTab('drafting')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'drafting' ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Drafting
          </button>
        </nav>

        {/* Right: Upload Button */}
        <div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Material
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 w-full h-full overflow-hidden relative">

        {/* 1. CASES VIEW */}
        {activeTab === 'cases' && (
          <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Active Cases</h2>
                </div>
                <button 
                  onClick={() => setIsCreatingCase(true)}
                  className="bg-[#1d1d1f] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Create Case File
                </button>
              </div>

              {/* Create Case Modal */}
              {isCreatingCase && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <h3 className="text-sm font-bold text-zinc-900">New Case Workspace</h3>
                      <button onClick={() => setIsCreatingCase(false)} className="text-zinc-400 hover:text-zinc-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <form onSubmit={handleCreateCase} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Case Title</label>
                        <input
                          type="text"
                          value={newCaseTitle}
                          onChange={e => setNewCaseTitle(e.target.value)}
                          placeholder="e.g. Kariuki v. Attorney General"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Reference No.</label>
                        <input
                          type="text"
                          value={newCaseRef}
                          onChange={e => setNewCaseRef(e.target.value)}
                          placeholder="e.g. LV-2026-084"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Practice Area</label>
                        <select
                          value={newCaseArea}
                          onChange={e => setNewCaseArea(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500"
                        >
                          <option>Commercial Litigation</option>
                          <option>Constitutional Law</option>
                          <option>Appellate</option>
                          <option>Land & Property</option>
                          <option>Intellectual Property</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Case Facts / Notes</label>
                        <textarea
                          value={newCaseFacts}
                          onChange={e => setNewCaseFacts(e.target.value)}
                          rows={3}
                          placeholder="Key facts, legal arguments..."
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsCreatingCase(false)} className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl">Cancel</button>
                        <button type="submit" className="bg-[#1d1d1f] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black shadow-sm">Save Case</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Cases Grid */}
              {cases.length === 0 ? (
                <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-3xl p-8 max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mx-auto mb-3">
                    <FolderPlus className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">No Active Case Files</h3>
                  <p className="text-xs text-zinc-500 mt-1 mb-5">Create a case file to organize legal authorities, research briefs, and evidence.</p>
                  <button 
                    onClick={() => setIsCreatingCase(true)}
                    className="bg-[#1d1d1f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Open First Case File
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cases.map((c) => (
                    <div key={c.id} className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-md transition-all group">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="bg-blue-50 text-[#0071e3] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-blue-100">
                            {c.practiceArea || 'Legal Matter'}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">{c.referenceNo}</span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#0071e3] transition-colors leading-tight mb-2">
                          {c.title}
                        </h3>
                        <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                          {c.facts || 'Active legal workspace file.'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-4">
                        <button 
                          onClick={() => { setSelectedCase(c); setIsCaseDetailOpen(true); setActiveTab('ai'); }} 
                          className="text-xs font-bold text-zinc-900 hover:text-[#0071e3] flex items-center gap-1 cursor-pointer"
                        >
                          Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCase(c.id)}
                          className="text-zinc-400 hover:text-rose-600 p-1"
                          title="Delete Case"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. eLEGAL SEARCH VIEW */}
        {activeTab === 'search' && (
          <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full space-y-6">

              {/* Search Box & Category Filters */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3 shadow-xs">
                <form 
                  onSubmit={(e) => { e.preventDefault(); runELegalSearch(eLegalQuery, eLegalSourceFilter); }}
                  className="flex flex-col md:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="text" 
                      value={eLegalQuery}
                      onChange={e => setELegalQuery(e.target.value)}
                      placeholder="Search Kenya Law authorities, judgment titles, or statutory sections..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isELegalLoading}
                    className="bg-[#1d1d1f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    title="Search eLegal Corpus"
                  >
                    {isELegalLoading ? <Sparkles className="w-4 h-4 animate-spin text-amber-300" /> : <Search className="w-4 h-4" />}
                  </button>
                </form>

                <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Filter Source:</span>
                  <button
                    onClick={() => { setELegalSourceFilter("all"); runELegalSearch(eLegalQuery, "all"); }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      eLegalSourceFilter === "all" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    All Authorities
                  </button>
                  <button
                    onClick={() => { setELegalSourceFilter("precedent"); runELegalSearch(eLegalQuery, "precedent"); }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      eLegalSourceFilter === "precedent" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    Case Law (Precedents)
                  </button>
                  <button
                    onClick={() => { setELegalSourceFilter("statute"); runELegalSearch(eLegalQuery, "statute"); }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      eLegalSourceFilter === "statute" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    Statutes (Acts of Parliament)
                  </button>
                </div>
              </div>

              {/* Search Results Display */}
              {isELegalLoading ? (
                <div className="text-center py-16 text-xs font-bold text-zinc-500 flex flex-col items-center gap-2">
                  <Sparkles className="w-6 h-6 animate-spin text-[#0071e3]" />
                  <span>Querying eLegal Engine & Grounding Authorities...</span>
                </div>
              ) : eLegalResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-1">Found {eLegalResults.length} Authentic Legal Authorities</p>
                  {eLegalResults.map((result, idx) => (
                    <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-blue-500/40 transition-all shadow-xs space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border ${
                              result.type === 'statute' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              {result.type}
                            </span>
                            <span className="text-xs font-bold text-zinc-600">{result.citation}</span>
                          </div>
                          <h3 className="text-sm font-bold text-zinc-900 leading-snug">{result.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed font-medium bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                        {result.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                        <div className="flex items-center gap-3">
                          <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#0071e3] hover:underline flex items-center gap-1">
                            Read Authority File <ArrowRight className="w-3 h-3" />
                          </a>
                          <a 
                            href={`/read.html?sourceUrl=${encodeURIComponent(result.url || '')}&title=${encodeURIComponent(result.title || '')}&type=${encodeURIComponent(result.type || '')}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-xs"
                          >
                            <FileText className="w-3 h-3 text-amber-300" /> Render PDF (read.html)
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleCopyCitation(result.citation, idx)}
                            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Copy Citation
                          </button>
                          <button 
                            onClick={() => handleSaveResultToMaterials(result)}
                            className="px-3 py-1.5 bg-[#1d1d1f] hover:bg-black text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <FolderPlus className="w-3 h-3" /> Save to Materials
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white border border-zinc-200 rounded-2xl p-6">
                  <Scale className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-600">No search results returned for "{eLegalQuery}"</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Enter specific statutes, case names, or legal keywords to query the legal corpus.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. MATERIALS / DOCUMENTS VIEW WITH AI SUMMARIZER */}
        {activeTab === 'materials' && (
          <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Materials & Evidence Library</h2>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#1d1d1f] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <FileUp className="w-4 h-4" /> Upload Document
                </button>
              </div>

              {mockDocuments.length === 0 ? (
                <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-3xl p-8 max-w-lg mx-auto">
                  <FileUp className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-zinc-900">Library is Empty</h3>
                  <p className="text-xs text-zinc-500 mt-1 mb-4">Upload case briefs, PDF rulings, statutory acts, or evidentiary files.</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#1d1d1f] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Material
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xs hover:border-blue-500/40 transition-all">
                      <div className="flex items-start gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center font-bold text-xs shrink-0">
                          {doc.type}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-zinc-900 truncate">{doc.name}</h4>
                          <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{doc.size || '1.5 MB'} • {doc.date}</p>
                          <p className="text-[11px] text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">{doc.excerpt || doc.extractedText}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-3 mt-1">
                        <button 
                          onClick={() => handleAnalyzeDocument(doc)}
                          className="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-800 border border-yellow-500/30 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-600" /> AI Summarize
                        </button>
                        <button 
                          onClick={() => openPDFReader(doc)}
                          className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          Read Text
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. RESEARCH AI CHAT VIEW (Gemini + Grounded Search) */}
        {activeTab === 'ai' && (
          <div className="h-full flex flex-col relative bg-[#fafafa]">
            
            {/* Scrollable Chat Message Area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full space-y-5">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* User Bubble */}
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-[#0071e3] text-white p-4 rounded-3xl rounded-tr-none text-xs font-medium leading-relaxed shadow-sm">
                      {msg.attachedMaterials && msg.attachedMaterials.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 border-b border-white/20 pb-2">
                          {msg.attachedMaterials.map((mat, i) => (
                            <span key={i} className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Paperclip className="w-3 h-3" /> {mat}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  ) : (
                    /* AI Bubble */
                    <div className="max-w-[88%] bg-white border border-zinc-200/80 p-5 rounded-3xl rounded-tl-none text-xs text-zinc-800 font-medium leading-relaxed shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#1d1d1f] text-amber-300 flex items-center justify-center text-[10px]">
                            <Sparkles className="w-3 h-3" />
                          </div>
                          <span className="font-bold text-zinc-900 text-xs">LexAI Assistant</span>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                      
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="pt-2 border-t border-zinc-100">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Verified Authorities & Sources:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((s, i) => (
                              <a 
                                key={i} 
                                href={s.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-zinc-200 flex items-center gap-1 transition-colors"
                              >
                                {s.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-2 bg-white border border-zinc-200/80 px-4 py-3 rounded-2xl w-fit text-xs font-bold text-zinc-500 shadow-xs">
                  <Sparkles className="w-4 h-4 animate-spin text-[#0071e3]" />
                  <span>Synthesizing statutes, user materials & verifying authorities via Google Search...</span>
                </div>
              )}
            </div>

            {/* Bottom Sticky Chat Input Bar */}
            <div className="p-4 bg-white/90 backdrop-blur-md border-t border-zinc-200/80 shrink-0">
              <div className="max-w-4xl mx-auto w-full space-y-2">
                
                {/* Attached Materials Pills */}
                {attachedDocs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-1">
                    {attachedDocs.map((doc) => (
                      <span key={doc.id} className="bg-blue-50 border border-blue-200 text-[#0071e3] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <Paperclip className="w-3 h-3" /> {doc.name}
                        <button onClick={() => setAttachedDocs(prev => prev.filter(d => d.id !== doc.id))} className="hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/90 rounded-2xl p-2 focus-within:border-blue-500 transition-colors shadow-xs">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 rounded-xl hover:bg-zinc-200/60 flex items-center justify-center text-zinc-600 transition-colors cursor-pointer shrink-0"
                    title="Attach legal document or evidence file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input 
                    type="text" 
                    value={chatInputText}
                    onChange={e => setChatInputText(e.target.value)}
                    placeholder="Ask LexAI a legal question, analyze case facts, or query statutes..."
                    className="flex-1 bg-transparent px-2 py-1 text-xs font-medium text-zinc-900 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={isChatLoading || (!chatInputText.trim() && attachedDocs.length === 0)}
                    className="w-9 h-9 bg-[#1d1d1f] hover:bg-black disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* 5. DRAFTING VIEW (Groq Llama-3.3-70B 5,000-Word Engine + Controls) */}
        {activeTab === 'drafting' && (
          <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full space-y-6">
              
              {/* Simple Minimalist Section Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Legal Document Drafter</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Controls & Inputs (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">Drafting Specifications</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Document Type</label>
                    <select
                      value={submissionType}
                      onChange={e => setSubmissionType(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                    >
                      <option value="Formal Skeleton Argument">Formal Skeleton Argument</option>
                      <option value="Memorandum of Appeal">Memorandum of Appeal</option>
                      <option value="Plaint & Verifying Affidavit">Plaint & Verifying Affidavit</option>
                      <option value="Written Statement of Defence">Written Statement of Defence</option>
                      <option value="Amicus Curiae Legal Brief">Amicus Curiae Legal Brief</option>
                      <option value="Legal Opinion & Client Advisory">Legal Opinion & Client Advisory</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Court / Forum</label>
                      <select
                        value={courtForum}
                        onChange={e => setCourtForum(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                      >
                        <option value="Supreme Court of Kenya">Supreme Court of Kenya</option>
                        <option value="Court of Appeal of Kenya">Court of Appeal of Kenya</option>
                        <option value="High Court of Kenya">High Court of Kenya</option>
                        <option value="Employment & Land Court">Employment & Land Court</option>
                        <option value="Chief Magistrates Court">Chief Magistrates Court</option>
                        <option value="East African Court of Justice">East African Court of Justice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Target Word Length</label>
                      <select
                        value={wordCountTarget}
                        onChange={e => setWordCountTarget(Number(e.target.value))}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs font-bold focus:outline-none focus:border-blue-500"
                      >
                        <option value={1500}>~1,500 Words (Standard Brief)</option>
                        <option value={3000}>~3,000 Words (Full Submissions)</option>
                        <option value={5000}>~5,000 Words (Exhaustive Brief)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Client / Party Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Wambui (Applicant)"
                      value={clientNameInput}
                      onChange={e => setClientNameInput(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Case Facts & Legal Grounds *</label>
                    <textarea 
                      value={draftNotes}
                      onChange={e => setDraftNotes(e.target.value)}
                      rows={8}
                      placeholder="Enter case facts, statutory sections relied upon, and specific prayers sought..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  <button 
                    onClick={handleGenerateDraft}
                    disabled={isDrafting || !draftNotes.trim()}
                    className="w-full bg-[#1d1d1f] hover:bg-black text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    {isDrafting ? <Sparkles className="w-4 h-4 animate-spin text-amber-300" /> : <FileText className="w-4 h-4" />}
                    <span>{isDrafting ? "Synthesizing 5000-Word Legal Brief..." : "Execute Groq Legal Draft Engine"}</span>
                  </button>
                </div>

                {/* Right Output Viewer (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-5 space-y-3 shadow-xs flex flex-col min-h-[500px]">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">Generated Legal Submission</h3>
                      {draftEngineUsed && (
                        <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Engine: {draftEngineUsed}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 font-bold bg-zinc-100 px-2.5 py-1 rounded-md">
                        {outputWordCount} words | {outputCharCount} chars
                      </span>
                      {draftOutput && (
                        <button 
                          onClick={() => { navigator.clipboard.writeText(draftOutput); showToast("Draft copied to clipboard!"); }}
                          className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea 
                    value={draftOutput}
                    readOnly
                    placeholder="Generated legal submission draft will appear here..."
                    className="flex-1 w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs font-mono text-zinc-800 focus:outline-none leading-relaxed min-h-[420px]"
                  />
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* MINIMALIST LIGHT-THEME FULL-VIEWPORT DOCUMENT READER */}
      {isPDFReaderOpen && viewingDoc && (
        <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden text-neutral-900 m-0 p-0">
          {/* Header Bar: Only Back Icon & File Name */}
          <header className="h-12 px-4 border-b border-neutral-200 bg-white flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPDFReaderOpen(false)}
              className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-700 hover:text-black transition cursor-pointer flex items-center justify-center shrink-0"
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-800" />
            </button>
            <h1 className="text-sm font-semibold text-neutral-900 truncate tracking-tight font-sans">
              {viewingDoc.name}
            </h1>
          </header>

          {/* Dedicated Full Viewport Document Body */}
          <main className="flex-1 w-full h-full bg-white overflow-hidden flex flex-col">
            {viewingDoc.type === 'PDF' || (viewingDoc.fileDataUrl && viewingDoc.fileDataUrl.startsWith('data:application/pdf')) || (viewingDoc.name.toLowerCase().endsWith('.pdf')) ? (
              <iframe
                src={viewingDoc.fileDataUrl || viewingDoc.pdfUrl || viewingDoc.sourceUrl}
                className="w-full h-full border-0 flex-1"
                title={viewingDoc.name}
              />
            ) : (
              <div className="flex-1 w-full h-full p-6 sm:p-12 overflow-y-auto font-sans text-sm sm:text-base text-neutral-900 leading-relaxed bg-white">
                <div className="max-w-4xl mx-auto whitespace-pre-wrap">
                  {viewingDoc.extractedText || viewingDoc.excerpt || "No document text available."}
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* AI DOCUMENT SUMMARIZER MODAL */}
      {analyzingDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full max-h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-zinc-200">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-bold text-zinc-900 truncate">Document Analysis: {analyzingDoc.name}</h3>
              </div>
              <button onClick={() => setAnalyzingDoc(null)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto text-xs text-zinc-800 leading-relaxed font-sans">
              {isAnalyzingDoc ? (
                <div className="text-center py-12 space-y-3">
                  <Sparkles className="w-6 h-6 animate-spin text-[#0071e3] mx-auto" />
                  <p className="font-bold text-zinc-600">Analyzing document text structure...</p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap font-sans space-y-2 text-sm text-zinc-800 leading-relaxed">
                  {docAnalysisSummary}
                </div>
              )}
            </div>

            <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setAnalyzingDoc(null)}
                className="px-4 py-2 bg-[#1d1d1f] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResearchCoHelper;
