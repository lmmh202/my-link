"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminProfilePlaceholder() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl p-6 text-zinc-100 ring-0">
      <CardHeader className="p-0 mb-2 border-none">
        <CardTitle className="text-xl font-bold">프로필 설정</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-zinc-400 text-sm">
          이곳에서 프로필 사진, 이름, 소개글을 변경할 수 있습니다. (Phase 3에서 구현 예정)
        </p>
      </CardContent>
    </Card>
  );
}
