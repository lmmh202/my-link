"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  User as UserIcon,
  Edit3,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Link2,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

interface UserProfile {
  userId: string;
  displayName: string;
  bioText: string;
  profileImageUrl: string;
  username: string;
}

export default function AdminProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Editing state variables
  const [editingField, setEditingField] = useState<"displayName" | "bioText" | "username" | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Status message state variables
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [origin] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.host;
    }
    return "mylink.com";
  });

  // Initialize and listen to User Profile in Firestore
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      async (docSnap) => {
        if (!docSnap.exists()) {
          // Initialize default profile using Google account metadata
          const defaultUsername = user.email ? user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "") : user.uid;
          const newProfile: UserProfile = {
            userId: user.uid,
            displayName: user.displayName || "사용자",
            bioText: "저의 채널을 방문해주셔서 감사합니다! 🚀",
            profileImageUrl: user.photoURL || "",
            username: defaultUsername || user.uid,
          };
          try {
            await setDoc(userDocRef, {
              ...newProfile,
              createdAt: serverTimestamp(),
            });
            setProfile(newProfile);
          } catch (err) {
            console.error("Error creating default profile in Firestore:", err);
          }
        } else {
          setProfile(docSnap.data() as UserProfile);
        }
        setProfileLoading(false);
      },
      (err) => {
        console.error("Error listening to user profile:", err);
        setProfileLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handle beginning inline editing mode
  const handleStartEdit = (field: "displayName" | "bioText" | "username", value: string) => {
    setEditingField(field);
    setTempValue(value);
    setError(null);
    setSuccess(null);
  };

  // Handle canceling inline editing mode
  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
    setError(null);
  };

  // Process saving changes to Firestore with validation checks
  const handleSaveField = async (field: "displayName" | "bioText" | "username") => {
    if (!user || !profile) return;

    setError(null);
    setSuccess(null);
    const value = tempValue.trim();

    // 1. Display Name constraints check
    if (field === "displayName") {
      if (!value) {
        setError("이름을 입력해 주세요.");
        return;
      }
      if (value.length > 30) {
        setError("이름은 최대 30자 이하여야 합니다.");
        return;
      }
    }

    // 2. Bio text constraints check
    if (field === "bioText") {
      if (value.length > 200) {
        setError("소개글은 최대 200자 이하여야 합니다.");
        return;
      }
    }

    // 3. Username format and uniqueness verification
    if (field === "username") {
      if (!value) {
        setError("닉네임을 입력해 주세요.");
        return;
      }
      const usernameRegex = /^[a-z0-9_-]+$/;
      if (!usernameRegex.test(value)) {
        setError("닉네임은 영문 소문자, 숫자, 언더바(_), 대시(-)만 사용할 수 있습니다.");
        return;
      }
      if (value.length < 3) {
        setError("닉네임은 최소 3자 이상이어야 합니다.");
        return;
      }
      if (value.length > 20) {
        setError("닉네임은 최대 20자 이하여야 합니다.");
        return;
      }

      setSaving(true);
      try {
        // Query Firestore to verify username is unique and not claimed by another UID
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", value));
        const querySnapshot = await getDocs(q);

        const isDuplicate = querySnapshot.docs.some((docSnap) => docSnap.id !== user.uid);
        if (isDuplicate) {
          setError("이미 사용 중인 닉네임입니다. 다른 닉네임을 설정해 주세요.");
          setSaving(false);
          return;
        }
      } catch (err) {
        console.error("Username validation check failed:", err);
        setError("닉네임 중복 확인 도중 오류가 발생했습니다.");
        setSaving(false);
        return;
      }
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        [field]: value,
      });
      setSuccess("프로필 설정이 성공적으로 저장되었습니다.");
      setEditingField(null);
    } catch (err) {
      console.error("Profile modification save failed:", err);
      setError("프로필을 저장하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  // Full screen loader while user authentication or Firestore data pulls load
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="w-8 h-8 text-emerald-400" />
          <p className="text-sm text-zinc-500">프로필 설정을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  // Fallback state if auth context holds empty session
  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6 text-center">
        <Card className="max-w-md w-full bg-zinc-900/60 border-zinc-800/80 p-8 space-y-4 text-zinc-100 ring-0">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">인증이 필요합니다</h2>
          <p className="text-sm text-zinc-400">관리자 대시보드에 접근하기 위해 로그인해 주세요.</p>
          <Button asChild className="w-full bg-zinc-100 text-zinc-950 hover:bg-white transition-colors font-bold rounded-xl h-11 border-none">
            <Link href="/login">로그인하러 가기</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const publicPagePath = `/${profile.username}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent flex items-center gap-2.5">
            <UserIcon className="w-7 h-7 text-emerald-400" />
            프로필 설정
          </h1>
          <p className="text-sm text-zinc-400">
            공개 페이지에 노출될 이름, 소개글 및 고유 닉네임 주소를 실시간으로 변경하세요.
          </p>
        </div>
        <Badge variant="outline" className="hidden sm:inline-flex items-center gap-2 h-auto px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>실시간 저장 활성화</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inline Profile Editing Controls */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden ring-0 text-zinc-100">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400" />
            
            <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded bg-emerald-500" />
              내 프로필 정보 편집
            </h2>

            {/* Error and Success Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6 flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-xs leading-relaxed animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-400 text-xs leading-relaxed animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {/* Static Avatar Circle Display */}
              <div className="border-b border-zinc-800/80 pb-6">
                <Label className="text-xs font-semibold text-zinc-400 block mb-3">프로필 사진</Label>
                <div className="flex items-center gap-4">
                  <div className="relative rounded-full bg-gradient-to-tr from-emerald-500/30 to-teal-400/30 p-[2px] shadow-inner">
                    <Avatar className="w-16 h-16 border-2 border-zinc-900 shrink-0">
                      <AvatarImage src={profile.profileImageUrl || undefined} className="object-cover w-full h-full" />
                      <AvatarFallback className="w-full h-full bg-zinc-850 flex items-center justify-center text-zinc-400">
                        <UserIcon className="w-7 h-7" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 leading-normal">
                      프로필 이미지는 구글 소셜 로그인 계정의 프로필 사진으로 정적 유지됩니다.
                    </p>
                    <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded border border-zinc-700/50 hover:bg-zinc-800">
                      구글 연동 고정
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Display Name Field */}
              <div className="border-b border-zinc-800/80 pb-6 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-zinc-400">이름 (Display Name)</Label>
                  {editingField !== "displayName" && (
                    <Button
                      onClick={() => handleStartEdit("displayName", profile.displayName)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      수정
                    </Button>
                  )}
                </div>

                {editingField === "displayName" ? (
                  <div className="flex gap-2 animate-in fade-in duration-200">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="bg-zinc-950/80 border-zinc-800 text-sm h-10 flex-1 focus-visible:ring-emerald-500/50"
                      disabled={saving}
                      placeholder="공개 프로필에 보일 이름을 입력하세요"
                      maxLength={30}
                    />
                    <Button
                      onClick={() => handleSaveField("displayName")}
                      disabled={saving}
                      size="icon"
                      className="h-10 w-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shrink-0 border-none rounded-xl"
                      title="저장"
                    >
                      {saving ? <Spinner className="w-4 h-4 text-zinc-950" /> : <Check className="w-4 h-4 font-bold" />}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200 shrink-0 rounded-xl"
                      title="취소"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-zinc-200 pl-1 py-1">{profile.displayName}</p>
                )}
              </div>

              {/* Username/Nickname Field */}
              <div className="border-b border-zinc-800/80 pb-6 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-zinc-400">닉네임 (Username / URL 주소)</Label>
                  {editingField !== "username" && (
                    <Button
                      onClick={() => handleStartEdit("username", profile.username)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      수정
                    </Button>
                  )}
                </div>

                {editingField === "username" ? (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">
                          {origin}/
                        </span>
                        <Input
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value.toLowerCase())}
                          className="bg-zinc-950/80 border-zinc-800 text-sm h-10 w-full pl-[92px] pr-4 font-mono focus-visible:ring-emerald-500/50"
                          disabled={saving}
                          placeholder="username"
                          maxLength={20}
                        />
                      </div>
                      <Button
                        onClick={() => handleSaveField("username")}
                        disabled={saving}
                        size="icon"
                        className="h-10 w-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shrink-0 border-none rounded-xl"
                        title="저장"
                      >
                        {saving ? <Spinner className="w-4 h-4 text-zinc-950" /> : <Check className="w-4 h-4 font-bold" />}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200 shrink-0 rounded-xl"
                        title="취소"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-zinc-500 pl-1 leading-normal">
                      * 닉네임은 영문 소문자, 숫자, 언더바(_), 대시(-) 조합의 3자~20자만 가능합니다.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pl-1 py-1">
                    <Badge variant="outline" className="px-2.5 py-1 rounded bg-zinc-950 border-zinc-800 text-xs font-mono text-emerald-400 hover:bg-zinc-950 font-bold">
                      @{profile.username}
                    </Badge>
                    <span className="text-xs text-zinc-500 font-mono">({origin}/{profile.username})</span>
                  </div>
                )}
              </div>

              {/* Bio Text Field */}
              <div className="pb-2 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-zinc-400">소개글 (Biography)</Label>
                  {editingField !== "bioText" && (
                    <Button
                      onClick={() => handleStartEdit("bioText", profile.bioText)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      수정
                    </Button>
                  )}
                </div>

                {editingField === "bioText" ? (
                  <div className="flex gap-2 items-start animate-in fade-in duration-200">
                    <Textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="bg-zinc-950/80 border-zinc-800 text-sm min-h-[90px] flex-1 resize-none rounded-xl focus-visible:ring-emerald-500/50 p-3"
                      disabled={saving}
                      placeholder="방문자들에게 보일 짧은 소개글을 적어주세요"
                      maxLength={200}
                    />
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        onClick={() => handleSaveField("bioText")}
                        disabled={saving}
                        size="icon"
                        className="h-10 w-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 border-none rounded-xl"
                        title="저장"
                      >
                        {saving ? <Spinner className="w-4 h-4 text-zinc-950" /> : <Check className="w-4 h-4 font-bold" />}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl"
                        title="취소"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-300 pl-1 py-1 whitespace-pre-wrap leading-relaxed">
                    {profile.bioText || <span className="text-zinc-600 text-xs italic">소개글이 없습니다.</span>}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Glassmorphic Smartphone Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded bg-teal-400" />
              실시간 모바일 미리보기
            </h2>
          </div>

          <div className="relative mx-auto w-full max-w-[320px] aspect-[9/18] bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-[38px] p-5 shadow-2xl flex flex-col items-center justify-between overflow-hidden relative group">
            {/* Blurry glow background effects inside the mock phone */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[220px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
            
            {/* Smartphone speaker notch */}
            <div className="w-24 h-4.5 bg-zinc-900 rounded-full mb-6 flex items-center justify-center shrink-0 border border-zinc-850 z-10" />

            <div className="flex-grow w-full flex flex-col items-center text-center space-y-5 z-10 pt-2 overflow-y-auto no-scrollbar">
              {/* Dynamic preview avatar circle */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-lg shadow-emerald-500/10">
                <Avatar className="w-full h-full bg-zinc-950 overflow-hidden flex items-center justify-center rounded-full border-none">
                  <AvatarImage src={profile.profileImageUrl || undefined} className="w-full h-full object-cover" />
                  <AvatarFallback className="w-full h-full bg-zinc-950 flex items-center justify-center rounded-full text-zinc-500">
                    <UserIcon className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shadow shadow-emerald-500/10">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>

              {/* Dynamic preview names */}
              <div className="space-y-1.5 w-full px-2">
                <h3 className="text-lg font-extrabold text-zinc-100 truncate leading-tight">
                  {editingField === "displayName" ? tempValue.trim() || profile.displayName : profile.displayName}
                </h3>
                <Badge variant="outline" className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-850 text-[10px] font-semibold text-emerald-400 hover:bg-zinc-900">
                  @{editingField === "username" ? tempValue.trim() || profile.username : profile.username}
                </Badge>
              </div>

              {/* Dynamic preview bio text */}
              <p className="text-xs text-zinc-400 leading-relaxed max-w-[200px] whitespace-pre-wrap break-all px-2">
                {editingField === "bioText" ? tempValue.trim() || profile.bioText : profile.bioText}
              </p>

              {/* Stylized Mock Link Buttons Stack */}
              <div className="w-full space-y-2.5 pt-4">
                {[
                  { title: "공식 소셜 채널 방문하기 📺" },
                  { title: "포트폴리오 구경하기 🌐" },
                ].map((mockLink, idx) => (
                  <div
                    key={idx}
                    className="w-full min-h-[46px] px-3.5 py-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl flex items-center justify-between text-zinc-400"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-850">
                        <Link2 className="w-3.5 h-3.5 text-emerald-400/80" />
                      </div>
                      <span className="text-[11px] font-bold text-zinc-300 truncate">{mockLink.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-650" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mock phone bottom brand footer */}
            <div className="pt-6 pb-1 text-center w-full z-10 shrink-0">
              <Button
                asChild
                variant="outline"
                className="h-7 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              >
                <Link href={publicPagePath} target="_blank">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  <span>공개 주소 방문</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
