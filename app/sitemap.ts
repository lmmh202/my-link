import { MetadataRoute } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const runtime = "nodejs";

interface UserProfile {
  username?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://my-link-sable.vercel.app";

  // Static site entry links
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    // Dynamic Firestore profile extraction
    const usersCol = collection(db, "users");
    const querySnap = await getDocs(usersCol);

    querySnap.forEach((docSnap) => {
      const data = docSnap.data() as UserProfile;
      const username = data.username;

      if (username) {
        sitemapEntries.push({
          url: `${baseUrl}/${username}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
    });
  } catch (error) {
    console.error("Error generating sitemap dynamically:", error);
  }

  return sitemapEntries;
}
