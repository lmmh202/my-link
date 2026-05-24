import { ImageResponse } from "next/og";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export const runtime = "nodejs";

export const alt = "My Link Profile Card";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OGImageProps {
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
    console.error("Error fetching profile in OG generator:", error);
  }
  return null;
}

async function fetchAvatarAsBase64(imageUrl: string | undefined): Promise<string | null> {
  if (!imageUrl) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 seconds timeout

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "MyLinkOGImageGenerator/1.0",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const mimeType = response.headers.get("content-type") || "image/png";
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.warn("Failed to fetch avatar image for OG rendering, falling back:", error);
    return null;
  }
}

export default async function OGImage({ params }: OGImageProps) {
  const { username } = await params;
  const profile = await fetchProfile(username);

  // Setup layout variables based on search results
  const displayName = profile?.displayName || "사용자를 찾을 수 없습니다";
  const handle = profile?.username || username || "mylink";
  const bioText = profile?.bioText || "My Link에서 다양한 링크를 하나의 아름다운 페이지로 연결하세요.";
  const avatarUrl = profile?.profileImageUrl;

  // Try to load external avatar image
  const base64Avatar = await fetchAvatarAsBase64(avatarUrl);

  // Initials for fallback
  const firstLetter = displayName.trim().charAt(0).toUpperCase() || "?";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Background Glowing Orbs */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.1) 0%, rgba(20,184,166,0) 70%)",
          }}
        />

        {/* Dynamic Profile Card Container */}
        <div
          style={{
            width: "920px",
            height: "460px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(24, 24, 27, 0.7)",
            border: "1px solid rgba(63, 63, 70, 0.45)",
            borderRadius: "36px",
            padding: "48px",
            position: "relative",
          }}
        >
          {/* Avatar Container with neon gradient border */}
          <div
            style={{
              width: "148px",
              height: "148px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #10b981, #14b8a6)",
              padding: "4px",
              marginBottom: "24px",
            }}
          >
            {base64Avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={base64Avatar}
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#09090b",
                  color: "#34d399",
                  fontSize: "64px",
                  fontWeight: "bold",
                }}
              >
                {firstLetter}
              </div>
            )}
          </div>

          {/* User Display Name */}
          <div
            style={{
              fontSize: "44px",
              fontWeight: "900",
              color: "#f4f4f5",
              marginBottom: "12px",
              letterSpacing: "-0.03em",
              textAlign: "center",
            }}
          >
            {displayName}
          </div>

          {/* Username handle badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "700",
              color: "#34d399",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "9999px",
              padding: "6px 20px",
            }}
          >
            @{handle}
          </div>

          {/* Bio text block */}
          <div
            style={{
              fontSize: "20px",
              color: "#a1a1aa",
              maxWidth: "680px",
              textAlign: "center",
              marginTop: "24px",
              lineHeight: "1.6",
            }}
          >
            {bioText}
          </div>

          {/* Branding Badge */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              display: "flex",
              alignItems: "center",
              color: "#71717a",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#09090b"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            My Link
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
