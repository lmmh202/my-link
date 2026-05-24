"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Link2,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface LinkItem {
  id: string;
  linkTitle: string;
  targetUrl: string;
  createdAt?: any;
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState("");
  const [editUrlInput, setEditUrlInput] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Real-time synchronization with Firestore
  useEffect(() => {
    const colRef = collection(db, "users", "anonymous", "links");
    const q = query(colRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: LinkItem[] = [];
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          } as LinkItem);
        });
        setLinks(items);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore links fetch failed:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper to validate and format URL
  const formatAndValidateUrl = (url: string): string => {
    let cleanUrl = url.trim();
    if (!cleanUrl) {
      throw new Error("URL을 입력해 주세요.");
    }
    
    // Auto-prepend https:// if no protocol is given
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch {
      throw new Error("올바른 형식의 URL을 입력해 주세요 (예: google.com).");
    }
  };

  // Add a new link
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const title = titleInput.trim();
    if (!title) {
      setError("링크 제목을 입력해 주세요.");
      return;
    }

    let url = "";
    try {
      url = formatAndValidateUrl(urlInput);
    } catch (err: any) {
      setError(err.message);
      return;
    }

    setSubmitting(true);
    try {
      const colRef = collection(db, "users", "anonymous", "links");
      await addDoc(colRef, {
        linkTitle: title,
        targetUrl: url,
        clickCount: 0,
        createdAt: serverTimestamp(),
      });

      // Clear input fields
      setTitleInput("");
      setUrlInput("");
    } catch (err: any) {
      console.error("Error adding link:", err);
      setError("링크 추가에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a link
  const handleDeleteLink = async (id: string) => {
    setDeletingId(id);
    try {
      const docRef = doc(db, "users", "anonymous", "links", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting link:", err);
      alert("링크 삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // Start inline editing mode
  const handleStartEdit = (link: LinkItem) => {
    setEditingId(link.id);
    setEditTitleInput(link.linkTitle);
    setEditUrlInput(link.targetUrl);
    setEditError(null);
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitleInput("");
    setEditUrlInput("");
    setEditError(null);
  };

  // Save changes
  const handleSaveEdit = async (id: string) => {
    setEditError(null);

    const title = editTitleInput.trim();
    if (!title) {
      setEditError("링크 제목을 입력해 주세요.");
      return;
    }

    let url = "";
    try {
      url = formatAndValidateUrl(editUrlInput);
    } catch (err: any) {
      setEditError(err.message);
      return;
    }

    setSavingId(id);
    try {
      const docRef = doc(db, "users", "anonymous", "links", id);
      await updateDoc(docRef, {
        linkTitle: title,
        targetUrl: url,
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error updating link:", err);
      setEditError("수정에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent flex items-center gap-2.5">
            <Link2 className="w-7 h-7 text-emerald-400" />
            링크 관리
          </h1>
          <p className="text-sm text-zinc-400">
            공유하고자 하는 소셜 링크, 웹사이트를 간편하게 추가하고 관리하세요.
          </p>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>실시간 저장 활성화</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Add Link Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Background glowing line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400" />
            
            <h2 className="text-lg font-bold text-zinc-100 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded bg-emerald-500" />
              새 링크 추가
            </h2>

            <form onSubmit={handleAddLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400" htmlFor="link-title">
                  링크 제목
                </label>
                <input
                  id="link-title"
                  type="text"
                  placeholder="예: 공식 웹사이트 🌐"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400" htmlFor="target-url">
                  연결할 주소 (URL)
                </label>
                <div className="relative">
                  <input
                    id="target-url"
                    type="text"
                    placeholder="예: mylink.com 또는 https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    disabled={submitting}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-xs leading-relaxed animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold hover:shadow-lg hover:shadow-emerald-500/10 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>추가하기</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Links List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded bg-teal-400" />
              나의 링크 목록
              {links.length > 0 && (
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full font-medium ml-1">
                  {links.length}개
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-16 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-sm text-zinc-500">링크 목록을 실시간으로 가져오는 중입니다...</p>
            </div>
          ) : links.length === 0 ? (
            /* Empty State */
            <div className="bg-zinc-900/30 border border-zinc-800/60 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <Link2 className="w-6 h-6 text-zinc-500" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-md font-bold text-zinc-300">등록된 링크가 없습니다</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  왼쪽 폼을 활용하여 첫 번째 링크를 추가해 주세요. 추가된 링크는 즉시 저장되어 공유할 수 있게 됩니다.
                </p>
              </div>
            </div>
          ) : (
            /* Link Cards List */
            <div className="space-y-3.5">
              {links.map((link) => {
                const isEditing = editingId === link.id;
                const isDeleting = deletingId === link.id;

                return (
                  <div
                    key={link.id}
                    className={`group relative bg-zinc-900/60 backdrop-blur-xl border rounded-2xl p-5 shadow-sm transition-all duration-300 ${
                      isEditing
                        ? "border-emerald-500/50 ring-1 ring-emerald-500/20"
                        : "border-zinc-800/80 hover:border-zinc-700/60 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    {isEditing ? (
                      /* Inline Edit Mode */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            링크 편집 중
                          </span>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-zinc-400">제목</label>
                            <input
                              type="text"
                              value={editTitleInput}
                              onChange={(e) => setEditTitleInput(e.target.value)}
                              className="w-full h-10 px-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                              placeholder="링크 제목"
                              disabled={savingId === link.id}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-zinc-400">URL</label>
                            <input
                              type="text"
                              value={editUrlInput}
                              onChange={(e) => setEditUrlInput(e.target.value)}
                              className="w-full h-10 px-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                              placeholder="https://..."
                              disabled={savingId === link.id}
                            />
                          </div>
                        </div>

                        {editError && (
                          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-rose-400 text-xs leading-none">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{editError}</span>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="h-8 px-3 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 hover:text-white transition-colors"
                            disabled={savingId === link.id}
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(link.id)}
                            className="h-8 px-3 rounded-lg bg-emerald-500 text-zinc-950 text-xs font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
                            disabled={savingId === link.id}
                          >
                            {savingId === link.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>저장</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          {/* Left Decorative Link Icon */}
                          <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800/80 group-hover:border-zinc-700/80 transition-all shrink-0">
                            <Link2 className="w-4 h-4 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
                          </div>

                          <div className="overflow-hidden space-y-1 text-left">
                            <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                              {link.linkTitle}
                            </h4>
                            <p className="text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors truncate flex items-center gap-1">
                              {link.targetUrl}
                              <ChevronRight className="w-3 h-3 text-zinc-600" />
                            </p>
                          </div>
                        </div>

                        {/* Right Buttons Actions */}
                        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                          {/* Visit Link */}
                          <a
                            href={link.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
                            title="링크 열기"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          
                          {/* Edit Link */}
                          <button
                            onClick={() => handleStartEdit(link)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="링크 수정"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Link */}
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            disabled={isDeleting}
                            className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                            title="링크 삭제"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
