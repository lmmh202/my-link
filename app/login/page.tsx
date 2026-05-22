"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isConfigured } from "@/lib/firebase";
import { Lock, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    if (!isConfigured) {
      setError("Firebase 설정이 완료되지 않았습니다. .env.local 파일을 구성해주세요.");
      return;
    }

    setIsLoggingIn(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "로그인 중 에러가 발생했습니다.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden text-zinc-100 px-4">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:border-zinc-700/60">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
            <Lock className="w-6 h-6 text-zinc-950" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-400 bg-clip-text text-transparent">
            My Link
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            나만의 멀티 링크 페이지를 만들고 공유하세요
          </p>
        </div>

        {/* Configuration Warning */}
        {!isConfigured && (
          <div className="mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-200 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold mb-1">Firebase 설정 필요</p>
              <p className="text-amber-300/80 leading-relaxed text-xs">
                로컬 개발을 위해 <code>.env.local</code> 파일을 생성하고 실제 Firebase API 키를 설정해주세요.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-200 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <p className="leading-relaxed text-xs">{error}</p>
          </div>
        )}

        {/* Social Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="group relative w-full h-12 flex items-center justify-center gap-3 bg-zinc-100 text-zinc-950 font-semibold rounded-xl transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-white/5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoggingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {/* Google Custom G Logo SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.927h6.6c-.285 1.514-1.14 2.79-2.42 3.646v3.027h3.91c2.28-2.1 3.655-5.19 3.655-8.53z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.955-1.08 7.94-2.91l-3.91-3.03c-1.08.72-2.47 1.16-4.03 1.16-3.1 0-5.725-2.095-6.66-4.91H1.28v3.13C3.26 21.31 7.37 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.34 14.32c-.24-.72-.38-1.49-.38-2.32s.14-1.6.38-2.32V6.55H1.28C.46 8.2.005 10.05.005 12c0 1.95.455 3.8 1.275 5.45l4.06-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.69 1.28 6.55l4.06 3.13C6.275 6.845 8.9 4.75 12 4.75z"
                />
              </svg>
              <span>Google로 계속하기</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
