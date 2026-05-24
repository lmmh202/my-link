"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { LogOut, Link2, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <Spinner className="w-8 h-8 text-emerald-400" />
      </div>
    );
  }

  const navItems = [
    { href: "/admin/profile", label: "프로필 관리", icon: UserIcon },
    { href: "/admin/links", label: "링크 관리", icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/10">
            <LayoutDashboard className="w-4 h-4 text-zinc-950" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            대시보드
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="w-9 h-9 border border-zinc-700 shrink-0">
              <AvatarImage src={user.photoURL || undefined} alt="Profile" />
              <AvatarFallback className="w-full h-full bg-zinc-800 text-zinc-400 flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-semibold truncate leading-tight">
                {user.displayName || "사용자"}
              </p>
              <p className="text-xs text-zinc-500 truncate leading-none mt-1">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="p-2 w-9 h-9 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="로그아웃"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
