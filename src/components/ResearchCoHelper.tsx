import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  LayoutDashboard, Search, Folder, FileText, User, ChevronRight, 
  Plus, Upload, Trash2, FolderOpen, Send, Scale, BookOpen, Link as LinkIcon,
  X, Check, FolderPlus, Save, Bot, Loader2
} from "lucide-react";

interface CaseItem {
  id: number;
  title: string;
  status: string;
  lastUpdated: string;
}

interface DocumentItem {
  id: number;
  name: string;
  type: string;
  date: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
  isError?: boolean;
}

interface ResearchCoHelperProps {
  currentOfficeId?: string;
  userName?: string;
  activeMatterId?: string;
  onClose?: () => void;
}

export const ResearchCoHelper: React.FC<ResearchCoHelperProps> = ({
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'research' | 'resources' | 'drafting'>('cases');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  const [cases, setCases] = useState<CaseItem[]>([
    { id: 1, title: "Smith v. Jones (Property Dispute)", status: "Active", lastUpdated: "2026-07-28" },
    { id: 2, title: "Estate of Doe", status: "Pending", lastUpdated: "2026-07-25" },
  ]);

  const [mockDocuments, setMockDocuments] = useState<DocumentItem[]>([
    { id: 1, name: "Initial_Complaint.pdf", type: "PDF", date: "2026-07-01" },
    { id: 2, name: "Defendant_Response.docx", type: "Word", date: "2026-07-15" },
    { id: 3, name: "Contract_Addendum.pdf", type: "PDF", date: "2026-07-18" },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello. I am your Legal Research Co-helper. I have access to real-time information via Google Search. How can I assist you with this matter?' }
  ]);

  const [chatInputText, setChatInputText] = useState("");
  const [attachedDocs, setAttachedDocs] = useState<DocumentItem[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");

  const [draftNotes, setDraftNotes] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  const switchTab = (tabId: 'cases' | 'research' | 'resources' | 'drafting') => {
    setActiveTab(tabId);
  };

  const openCase = (id: number) => {
    const found = cases.find(c => c.id === id);
    if (found) {
      setSelectedCase(found);
      setChatMessages([
        { role: 'model', text: `Hello. I am your Legal Research Co-helper. I have access to real-time information via Google Search. How can I assist you with **${found.title}**?` }
      ]);
      setAttachedDocs([]);
      setActiveTab('research');
    }
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim()) return;

    const newCase: CaseItem = {
      id: Date.now(),
      title: newCaseTitle.trim(),
      status: "Active",
      lastUpdated: new Date().toISOString().split("T")[0]
    };

    setCases(prev => [newCase, ...prev]);
    setNewCaseTitle("");
    setIsCreatingCase(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newDocs: DocumentItem[] = [];
    Array.from(files).forEach(file => {
      let ext = file.name.split('.').pop()?.toUpperCase() || 'DOC';
      newDocs.push({
        id: Date.now() + Math.random(),
        name: file.name,
        type: ext,
        date: new Date().toISOString().split('T')[0]
      });
    });

    setMockDocuments(prev => [...prev, ...newDocs]);
    event.target.value = '';
  };

  const handleDeleteDocument = (id: number) => {
    setMockDocuments(prev => prev.filter(d => d.id !== id));
    setAttachedDocs(prev => prev.filter(d => d.id !== id));
  };

  const attachDocument = (docId: number) => {
    const doc = mockDocuments.find(d => d.id === docId);
    if (doc && !attachedDocs.some(d => d.id === docId)) {
      setAttachedDocs(prev => [...prev, doc]);
    }
  };

  const removeAttachedDocument = (docId: number) => {
    setAttachedDocs(prev => prev.filter(d => d.id !== docId));
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInputText.trim();
    if ((!text && attachedDocs.length === 0) || isChatLoading) return;

    let messageText = text;
    if (attachedDocs.length > 0) {
      const docNames = attachedDocs.map(d => d.name).join(', ');
      messageText = `[User attached the following reference documents for context: ${docNames}]\n\n${text}`;
    }

    const userMsg: ChatMessage = { role: 'user', text: messageText };
    setChatMessages(prev => [...prev, userMsg]);

    setChatInputText("");
    setAttachedDocs([]);
    setShowResources(false);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/lexai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: messageText,
          matterTitle: selectedCase?.title,
          caseContext: `Attached docs: ${attachedDocs.map(d => d.name).join(", ")}`
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
        text: "There was an error communicating with the AI legal service. Please verify server connection and try again.",
        isError: true
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
          submissionType: "Formal Legal Submission",
          matterTitle: selectedCase?.title || "Legal Matter",
          facts: draftNotes,
          researchNotes: draftNotes
        })
      });

      if (!response.ok) throw new Error("Drafting API failed");
      const data = await response.json();

      if (data.draft) {
        setDraftOutput(data.draft);
      } else {
        setDraftOutput("Error: Could not generate draft. Please try again.");
      }
    } catch (err) {
      console.error("Drafting error:", err);
      setDraftOutput("An error occurred while generating the draft.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSaveDraft = () => {
    alert("Draft saved successfully to case file!");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans overflow-hidden min-h-[600px] rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Navigation Links */}
            <nav className="flex space-x-1 sm:space-x-4">
              <button 
                onClick={() => switchTab('cases')} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'cases' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Cases</span>
              </button>
              <button 
                onClick={() => switchTab('research')} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'research' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Research</span>
              </button>
              <button 
                onClick={() => switchTab('resources')} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'resources' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <Folder className="w-4 h-4" />
                <span className="hidden sm:inline">Resources</span>
              </button>
              <button 
                onClick={() => switchTab('drafting')} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'drafting' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Drafting</span>
              </button>
            </nav>

            {/* User Profile & Active Case Status */}
            <div className="flex items-center gap-4">
              {selectedCase && (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-semibold">Active:</span>
                  <span className="max-w-[120px] truncate">{selectedCase.title}</span>
                </div>
              )}
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all">
                <User className="text-white w-4 h-4" />
              </div>
              {onClose && (
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-0 bg-slate-50 relative">
        <div className="w-full h-full relative">
          {/* TAB 1: CASES */}
          {activeTab === 'cases' && (
            <div className="space-y-8 animate-in fade-in duration-300 overflow-y-auto h-full pb-10 pr-2 p-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Case Directory</h2>
                  <p className="text-slate-500 mt-1">Manage matters, upload resources, and start AI-assisted research.</p>
                </div>
                <button 
                  onClick={() => setIsCreatingCase(!isCreatingCase)} 
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-5 h-5" /> New Matter
                </button>
              </div>

              {isCreatingCase && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 animate-in fade-in slide-in-from-top-4">
                  <form onSubmit={handleCreateCase} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Matter Name / Reference</label>
                      <input 
                        type="text" 
                        value={newCaseTitle}
                        onChange={(e) => setNewCaseTitle(e.target.value)}
                        placeholder="e.g., Doe Estate Planning or Project Alpha" 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors" 
                        autoFocus 
                        required 
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button type="button" onClick={() => setIsCreatingCase(false)} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">Cancel</button>
                      <button type="submit" className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm cursor-pointer">Create</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases.map((c) => {
                  const isActive = selectedCase?.id === c.id;
                  const statusClass = c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
                  const cardClass = isActive ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200';
                  return (
                    <div key={c.id} className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col group ${cardClass}`}>
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusClass}`}>{c.status}</span>
                          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Updated {c.lastUpdated}</span>
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{c.title}</h3>
                      </div>
                      <div className="border-t border-slate-100 p-4 bg-gradient-to-b from-transparent to-slate-50 rounded-b-2xl flex justify-between items-center mt-auto">
                        <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                          <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
                            <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                          </div> 
                          {mockDocuments.length} Docs
                        </div>
                        <button onClick={() => openCase(c.id)} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                          Open <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: RESEARCH */}
          {activeTab === 'research' && (
            <>
              {!selectedCase ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md mx-auto my-10">
                  <div className="bg-slate-50 p-4 rounded-full">
                    <FolderOpen className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-lg text-center font-medium text-slate-700">Please select a case to start researching.</p>
                  <button onClick={() => switchTab('cases')} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                    Go to Case Directory
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col animate-in fade-in duration-300 w-full relative">
                  <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
                    {/* Messages Area */}
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
                      {chatMessages.map((msg, index) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div key={index} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} group`}>
                            {!isUser && (
                              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                <Scale className="w-4 h-4 text-blue-700" />
                              </div>
                            )}

                            <div className={isUser ? 'max-w-[85%] md:max-w-3xl bg-slate-900 text-white shadow-md rounded-2xl rounded-tr-[4px] px-5 py-4' : (msg.isError ? 'max-w-[85%] md:max-w-3xl bg-red-50 text-red-800 border border-red-200 rounded-2xl rounded-tl-[4px] px-5 py-4' : 'max-w-[85%] md:max-w-3xl bg-white border border-slate-200 text-slate-700 shadow-sm rounded-2xl rounded-tl-[4px] px-5 py-4 leading-relaxed')}>
                              <div className={`prose prose-sm md:prose-base max-w-none ${isUser ? 'whitespace-pre-wrap text-white' : 'text-slate-700'}`}>
                                {isUser ? msg.text : <Markdown>{msg.text}</Markdown>}
                              </div>

                              {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-5 pt-4 border-t border-slate-100">
                                  <div className="flex items-center gap-2 mb-3">
                                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reference Sources</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {msg.sources.map((s, idx) => (
                                      <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm max-w-[280px]" title={s.title}>
                                        <LinkIcon className="w-3 h-3 flex-shrink-0 text-slate-400" />
                                        <span className="truncate">{s.title}</span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {isUser && (
                              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                <User className="w-4 h-4 text-slate-600" />
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {isChatLoading && (
                        <div className="flex gap-4 justify-start animate-in fade-in">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                            <Scale className="w-4 h-4 text-blue-700" />
                          </div>
                          <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-[4px] px-5 py-4 flex items-center gap-2 shadow-sm">
                            <span className="text-sm font-medium text-slate-500 mr-2">Researching</span>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-white border-t border-slate-200 relative shrink-0">
                      {/* Resources Popover */}
                      {showResources && (
                        <div className="absolute bottom-full left-4 mb-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2">
                          <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                              <FolderOpen className="w-4 h-4 text-blue-600" /> Case Resources
                            </h4>
                            <button onClick={() => setShowResources(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                            {mockDocuments.map((doc) => {
                              const isAttached = attachedDocs.some(d => d.id === doc.id);
                              return (
                                <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group transition-colors">
                                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                                    <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="text-xs font-medium text-slate-700 truncate">{doc.name}</span>
                                  </div>
                                  <button 
                                    onClick={() => attachDocument(doc.id)} 
                                    disabled={isAttached} 
                                    className={`p-1.5 rounded-md transition-colors flex-shrink-0 cursor-pointer ${isAttached ? 'text-green-500 bg-green-50 cursor-default' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-100'}`}
                                  >
                                    {isAttached ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Attached Docs Pills */}
                      {attachedDocs.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 px-1">
                          {attachedDocs.map(doc => (
                            <div key={doc.id} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-1">
                              <FileText className="w-3 h-3" />
                              <span className="max-w-[150px] truncate">{doc.name}</span>
                              <button type="button" onClick={() => removeAttachedDocument(doc.id)} className="hover:bg-blue-200 text-blue-500 hover:text-blue-800 rounded-full p-0.5 transition-colors ml-1 cursor-pointer">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all shadow-inner">
                        <button 
                          type="button" 
                          onClick={() => setShowResources(!showResources)} 
                          className={`p-2.5 rounded-full transition-colors shrink-0 mb-0.5 text-white shadow-sm cursor-pointer ${showResources ? 'bg-blue-800 ring-2 ring-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`} 
                          title="Attach Resource"
                        >
                          <FolderPlus className="w-[18px] h-[18px]" />
                        </button>

                        <textarea 
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          onKeyDown={handleChatKeyDown}
                          placeholder="Ask a question about the case or general law..." 
                          className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none max-h-32 min-h-[44px] py-2 px-2 text-sm text-slate-800" 
                          rows={1}
                        />

                        <button 
                          type="submit" 
                          disabled={(!chatInputText.trim() && attachedDocs.length === 0) || isChatLoading}
                          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-sm shrink-0 mb-0.5 cursor-pointer"
                        >
                          <Send className="w-[18px] h-[18px]" />
                        </button>
                      </form>

                      <div className="flex justify-between items-center mt-3 px-1">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                          AI responses require human verification.
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Press <kbd className="font-sans px-1 py-0.5 bg-slate-100 border border-slate-200 rounded">Enter</kbd> to send
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 3: RESOURCES */}
          {activeTab === 'resources' && (
            <>
              {!selectedCase ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md mx-auto my-10">
                  <div className="bg-slate-50 p-4 rounded-full">
                    <FolderOpen className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-lg text-center font-medium text-slate-700">Please select a case to manage resources.</p>
                  <button onClick={() => switchTab('cases')} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                    Go to Case Directory
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col animate-in fade-in duration-300 p-6 max-w-7xl mx-auto w-full">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Case Resources</h2>
                      <p className="text-slate-500 mt-1">Manage documents and reference materials for <strong>{selectedCase.title}</strong>.</p>
                    </div>
                    <div>
                      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm cursor-pointer">
                        <Upload className="w-5 h-5" /> Upload Files
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-y-auto flex-1 p-0">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Date Added</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {mockDocuments.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-16 text-center text-slate-500 bg-slate-50/30">
                                <div className="flex flex-col items-center justify-center">
                                  <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-slate-100">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                  </div>
                                  <p className="font-medium text-slate-600">No resources found.</p>
                                  <p className="text-sm mt-1">Upload documents to reference them in your research.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            mockDocuments.map(doc => (
                              <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4 flex items-center gap-3">
                                  <div className="p-2 bg-blue-50/50 border border-blue-100 text-blue-600 rounded-lg">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium text-slate-700 truncate max-w-sm">{doc.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs font-medium">{doc.type}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{doc.date}</td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 4: DRAFTING */}
          {activeTab === 'drafting' && (
            <>
              {!selectedCase ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md mx-auto my-10">
                  <div className="bg-slate-50 p-4 rounded-full">
                    <FolderOpen className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-lg text-center font-medium text-slate-700">Please select a case to begin drafting.</p>
                  <button onClick={() => switchTab('cases')} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                    Go to Case Directory
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300 p-6 max-w-7xl mx-auto w-full">
                  {/* Left Panel: Parameters */}
                  <div className="w-full lg:w-1/3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-1/2 lg:h-full overflow-y-auto shrink-0">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Drafting Parameters</h2>
                    <p className="text-sm text-slate-500 mb-6">
                      Provide notes, facts, and intended arguments. The AI will structure them into a formal legal draft.
                    </p>
                    
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div className="flex-1 flex flex-col min-h-[200px]">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Rough Notes & Key Points</label>
                        <textarea 
                          value={draftNotes}
                          onChange={(e) => setDraftNotes(e.target.value)}
                          placeholder="E.g., Defendant failed to deliver goods by July 1st. Email evidence attached shows they acknowledged the delay..." 
                          className="w-full flex-1 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors text-sm"
                        />
                      </div>
                      
                      <button 
                        onClick={handleGenerateDraft} 
                        disabled={isDrafting || !draftNotes.trim()} 
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all font-semibold shadow-md active:scale-[0.98] cursor-pointer"
                      >
                        {isDrafting ? (
                          <>
                            <Loader2 className="w-[18px] h-[18px] animate-spin" />
                            <span>Generating Draft...</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-[18px] h-[18px]" />
                            <span>Generate First Draft</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right Panel: Editor */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-1/2 lg:h-full min-h-[300px]">
                    <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-[18px] h-[18px] text-blue-600" /> Editor
                      </h3>
                      <button onClick={handleSaveDraft} className="flex items-center gap-1.5 text-sm text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors font-semibold shadow-sm border border-slate-200 cursor-pointer">
                        <Save className="w-4 h-4" /> Save Draft
                      </button>
                    </div>
                    <div className="flex-1 p-0 relative bg-slate-50/30 overflow-hidden">
                      <textarea 
                        value={draftOutput}
                        onChange={(e) => setDraftOutput(e.target.value)}
                        placeholder="Your generated draft will appear here ready for editing." 
                        className="w-full h-full p-8 outline-none resize-none font-serif text-slate-800 leading-relaxed bg-transparent absolute inset-0"
                      />
                      
                      {!draftOutput && !isDrafting && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-slate-400 flex flex-col items-center gap-4 bg-white/50 p-8 rounded-full">
                            <div className="p-4 bg-slate-100 rounded-full">
                              <FileText className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-medium text-slate-500">Document workspace is empty</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
