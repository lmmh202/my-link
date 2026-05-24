"use client";

import { use, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  updateDoc,
  increment,
} from "firebase/firestore";
import {
  Link2,
  ExternalLink,
  ChevronRight,
  User as UserIcon,
  AlertCircle,
  Home,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

interface UserProfile {
  userId: string;
  displayName: string;
  bioText: string;
  profileImageUrl: string;
  username: string;
}

interface LinkItem {
  id: string;
  linkTitle: string;
  targetUrl: string;
  clickCount: number;
}

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: PageProps) {
  const { username } = use(params);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchUserProfileAndLinks = async () => {
      try {
        setLoading(true);
        setError(null);

        let userId = "";
        let profileData: UserProfile | null = null;

        // 1. Search by username field
        const usersCol = collection(db, "users");
        const q = query(usersCol, where("username", "==", username));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const docSnap = querySnap.docs[0];
          userId = docSnap.id;
          profileData = docSnap.data() as UserProfile;
        } else {
          // 2. Fallback: Search by userId directly
          const directDocRef = doc(db, "users", username);
          const directDocSnap = await getDoc(directDocRef);
          if (directDocSnap.exists()) {
            userId = username;
            profileData = directDocSnap.data() as UserProfile;
          }
        }

        if (!profileData || !userId) {
          setError("사용자를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        setProfile(profileData);

        // 3. Set up real-time listener for the user's links
        const linksCol = collection(db, "users", userId, "links");
        const linksQuery = query(linksCol, orderBy("createdAt", "desc"));

        const unsubscribeLinks = onSnapshot(
          linksQuery,
          (snapshot) => {
            const items: LinkItem[] = [];
            snapshot.forEach((d) => {
              items.push({
                id: d.id,
                ...d.data(),
              } as LinkItem);
            });
            setLinks(items);
            setLoading(false);
          },
          (err) => {
            console.error("Error listening to public links:", err);
            setLoading(false);
          }
        );

        return unsubscribeLinks;
      } catch (err) {
        console.error("Error querying user profile:", err);
        setError("유저 데이터를 가져오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    let unsubscribeFn: (() => void) | undefined;
    fetchUserProfileAndLinks().then((unsub) => {
      if (unsub) unsubscribeFn = unsub;
    });

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, [username]);

  // Track link clicks in Firestore (non-blocking)
  const handleLinkClick = (linkId: string) => {
    if (!profile) return;
    const linkDocRef = doc(db, "users", profile.userId, "links", linkId);
    updateDoc(linkDocRef, {
      clickCount: increment(1),
    }).catch((err) => {
      console.error("Failed to increment click count:", err);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="w-8 h-8 text-emerald-400" />
          <p className="text-sm text-zinc-500">프로필을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 404 User Not Found or General Error
  if (error || !profile) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 px-4 overflow-hidden">
        {/* Decorative Background Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" />
        
        <Card className="relative max-w-md w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl text-center space-y-6 ring-0 text-zinc-100">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-200">
              {error || "오류가 발생했습니다"}
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              입력하신 주소에 해당하는 프로필이 존재하지 않거나, 잘못된 유저 정보입니다. 올바른 주소인지 다시 한번 확인해 주세요.
            </p>
          </div>

          <div className="pt-2">
            <Button
              asChild
              className="w-full h-11 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-white hover:text-zinc-950 font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-none"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                <span>홈으로 돌아가기</span>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between overflow-x-hidden py-12 px-4 select-none">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Main Business Card View */}
      <main className="max-w-md w-full mx-auto flex-grow flex flex-col items-center z-10 space-y-8">
        
        {/* User Info Section */}
        <div className="text-center space-y-4 w-full">
          {/* Avatar Container with glowing border */}
          <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/5 animate-in zoom-in-75 duration-500">
            <Avatar className="w-full h-full bg-zinc-950 overflow-hidden flex items-center justify-center rounded-full border-none">
              <AvatarImage src={profile.profileImageUrl || undefined} className="w-full h-full object-cover" />
              <AvatarFallback className="w-full h-full bg-zinc-950 flex items-center justify-center rounded-full">
                <UserIcon className="w-10 h-10 text-zinc-500" />
              </AvatarFallback>
            </Avatar>
            
            {/* Elegant Sparkle badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shadow shadow-emerald-500/10">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-4 duration-500 delay-100 fill-mode-both">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">
              {profile.displayName}
            </h1>
            <Badge variant="outline" className="inline-flex px-3 py-1 h-auto rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-emerald-400 hover:bg-zinc-900">
              @{profile.username}
            </Badge>
          </div>

          <p className="text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed px-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-200 fill-mode-both">
            {profile.bioText}
          </p>
        </div>

        {/* Links Stack */}
        <div className="w-full space-y-3.5 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          {links.length === 0 ? (
            <Card className="bg-zinc-900/30 border border-zinc-800/60 border-dashed rounded-2xl p-10 text-center space-y-2 text-zinc-100 ring-0">
              <Link2 className="w-5 h-5 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-500">아직 등록된 링크가 없습니다.</p>
            </Card>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="group w-full min-h-[58px] p-4 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700/60 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 active:scale-[0.99] transition-all rounded-2xl flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-850 group-hover:border-zinc-700/80 transition-colors shrink-0">
                    <Link2 className="w-4 h-4 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <h3 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                      {link.linkTitle}
                    </h3>
                    <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors truncate font-mono mt-0.5">
                      {link.targetUrl.replace(/^https?:\/\/(www\.)?/i, "")}
                    </p>
                  </div>
                </div>
                <div className="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            ))
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="z-10 pt-12 text-center animate-in fade-in duration-1000 delay-500 fill-mode-both">
        <Button
          asChild
          variant="outline"
          className="inline-flex items-center gap-2 h-auto px-4 py-2 rounded-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-900 text-xs font-bold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/80 hover:border-zinc-800 transition-all shadow"
        >
          <Link href="/">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/10 shrink-0">
              <Link2 className="w-3 h-3 text-zinc-950" />
            </div>
            <span>My Link로 만들기</span>
          </Link>
        </Button>
      </footer>
    </div>
  );
}
