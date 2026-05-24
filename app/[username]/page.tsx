import { Metadata } from "next";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import ProfileClient from "./ProfileClient";

export const runtime = "nodejs";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function fetchProfile(username: string) {
  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("username", "==", username));
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      return querySnap.docs[0].data();
    }

    const directDocRef = doc(db, "users", username);
    const directDocSnap = await getDoc(directDocRef);
    if (directDocSnap.exists()) {
      return directDocSnap.data();
    }
  } catch (error) {
    console.error("Error fetching profile in Server Component:", error);
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchProfile(username);

  if (profile) {
    return {
      title: `${profile.displayName} (@${profile.username}) | My Link`,
      description: profile.bioText || "Share all your links in one simple page",
    };
  }

  return {
    title: "사용자를 찾을 수 없습니다 | My Link",
    description: "입력하신 주소에 해당하는 프로필이 존재하지 않습니다.",
  };
}

export default async function Page({ params }: PageProps) {
  return <ProfileClient params={params} />;
}
