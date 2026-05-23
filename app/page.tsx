import Link from "next/link";
import { ArrowRight, Link2, Sparkles, ShieldCheck, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/10">
            <Link2 className="w-4 h-4 text-zinc-950" />
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            My Link
          </span>
        </div>
        <Link
          href="/login"
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-semibold transition-all hover:bg-zinc-800 hover:border-zinc-700 hover:text-white"
        >
          대시보드 가기
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 md:py-24 flex flex-col lg:flex-row items-center gap-12 z-10 flex-grow justify-center">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>나만의 링크 트리를 1분 만에 제작</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            나를 표현하는 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              단 하나의 링크
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            인스타그램, 틱톡, 유튜브 등 흩어져 있는 모든 SNS 링크를 하나의 페이지로 모으고, 클릭 통계 분석까지 실시간으로 받아보세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              href="/login"
              className="group w-full sm:w-auto h-14 px-8 rounded-2xl bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center gap-2 hover:bg-white hover:shadow-xl hover:shadow-white/5 active:scale-[0.98] transition-all"
            >
              <span>무료로 시작하기</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>간편한 구글 연동</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>실시간 클릭 분석</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="flex-1 w-full max-w-md relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-[40px] blur-3xl pointer-events-none" />
          {/* Glassmorphic Mockup Mobile Screen */}
          <div className="relative mx-auto w-full max-w-[300px] aspect-[9/18] bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[36px] p-4 shadow-2xl flex flex-col items-center">
            {/* Speaker & Camera notch */}
            <div className="w-24 h-4 bg-zinc-950 rounded-full mb-6 flex items-center justify-center" />
            
            {/* User Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mb-3">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-zinc-300 font-bold">
                Me
              </div>
            </div>
            <h3 className="font-bold text-sm text-zinc-100">@mylink_user</h3>
            <p className="text-[10px] text-zinc-500 mt-1 mb-6 text-center px-4">
              저의 새로운 소식과 채널을 확인하세요! 🚀
            </p>

            {/* Links Stack */}
            <div className="w-full space-y-2.5">
              {[
                { label: "유튜브 채널 구경가기 📺" },
                { label: "인스타그램 팔로우 📸" },
                { label: "공식 홈페이지 🌐" },
              ].map((link, idx) => (
                <div
                  key={idx}
                  className="w-full py-2.5 px-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-center text-xs font-semibold text-zinc-200 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
                >
                  {link.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-6 text-center text-zinc-600 text-xs z-10">
        <p>&copy; {new Date().getFullYear()} My Link. All rights reserved.</p>
      </footer>
    </div>
  );
}
