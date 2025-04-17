// === ROOT STRUCTURE === // // app/layout.tsx export default function RootLayout({ children }) { return ( <html lang="en"> <head> <script
async
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
></script> <title>GPT Hikaye Platformu</title> </head> <body>{children}</body> </html> ); }

// app/page.tsx import StoryList from "@/components/StoryList"; import Navbar from "@/components/Navbar";

export default function Home() { return ( <main className="p-4"> <Navbar /> <h1 className="text-3xl font-bold mb-4">GPT Destekli Hikaye Platformu</h1> <StoryList /> </main> ); }

// === COMPONENTS === // // components/Navbar.tsx import Link from "next/link";

export default function Navbar() { return ( <nav className="flex justify-between p-4 bg-gray-100 border-b"> <Link href="/">Anasayfa</Link> <div className="space-x-4"> <Link href="/write">Hikaye Yaz</Link> <Link href="/community">Topluluk</Link> <Link href="/login">Giriş</Link> </div> </nav> ); }

// components/StoryList.tsx import Link from "next/link";

const stories = [ { id: "1", title: "Karanlık Orman", premium: false }, { id: "2", title: "Gizemli Şehir", premium: true }, ];

export default function StoryList() { return ( <div className="grid gap-4"> {stories.map((story) => ( <Link key={story.id} href={/story/${story.id}} className="p-4 border rounded-xl hover:shadow-lg transition" > <h2 className="text-xl font-semibold">{story.title}</h2> <p>{story.premium ? "Premium" : "Ücretsiz"}</p> </Link> ))} </div> ); }

// components/AdSenseBox.tsx export default function AdSenseBox() { const isPremium = false; // Gerçek auth ile değiştir if (isPremium) return null; return ( <div className="my-4 text-center"> <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXXXXXXXX" data-ad-slot="XXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> </div> ); }

// === STORY PAGE === // // app/story/[id]/page.tsx 'use client'; import { useEffect, useState } from "react"; import AdSenseBox from "@/components/AdSenseBox"; import usePageActivity from "@/hooks/usePageActivity"; import { useParams } from "next/navigation";

export default function StoryPage() { const [content, setContent] = useState("Yükleniyor..."); const { interacted } = usePageActivity(); const { id } = useParams();

useEffect(() => { setTimeout(() => setContent("Karanlık bir ormanda uyanıyorsun..."), 500); }, []);

return ( <main className="p-4"> <h1 className="text-2xl font-bold mb-2">Hikaye #{id}</h1> <p className="mb-4">{content}</p> <button className="bg-blue-600 text-white p-2 rounded">Devam Et</button> <AdSenseBox /> {interacted && <p className="text-green-500 mt-4">Gerçek hit algılandı</p>} </main> ); }

// === STORY WRITER PAGE === // // app/write/page.tsx 'use client'; import { useState } from "react";

export default function WritePage() { const [theme, setTheme] = useState(""); const [input, setInput] = useState("");

const handleSubmit = () => { console.log("Hikaye temasına göre üretiliyor:", theme); };

return ( <main className="p-4 max-w-xl mx-auto"> <h2 className="text-2xl font-bold mb-4">Hikaye Teması Oluştur</h2> <textarea value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Bir tema yazın..." className="w-full border p-2 rounded mb-4" /> <button
onClick={handleSubmit}
className="bg-green-600 text-white px-4 py-2 rounded"
> Hikaye Oluştur </button> </main> ); }

// === COMMUNITY PAGE === // // app/community/page.tsx export default function CommunityPage() { const posts = [ { id: 1, title: "Ay Hikayesi", author: "user123" }, { id: 2, title: "Sanal Gerçeklik", author: "writerX" }, ];

return ( <main className="p-4"> <h2 className="text-2xl font-bold mb-4">Topluluk Paylaşımları</h2> <ul> {posts.map((post) => ( <li key={post.id} className="mb-2 border p-2 rounded"> <strong>{post.title}</strong> - {post.author} </li> ))} </ul> </main> ); }

// === AUTH PAGES (KABACA) === // // app/login/page.tsx export default function LoginPage() { return ( <main className="p-4 max-w-sm mx-auto"> <h2 className="text-xl font-bold mb-4">Giriş Yap</h2> <input className="w-full border p-2 mb-4" placeholder="E-posta" /> <input className="w-full border p-2 mb-4" placeholder="Şifre" type="password" /> <button className="bg-blue-600 text-white px-4 py-2 rounded">Giriş</button> </main> ); }

// === UTILITIES === // // hooks/usePageActivity.ts import { useEffect, useState } from "react";

export default function usePageActivity(minReadTime = 120000) { const [startTime] = useState(Date.now()); const [isFocused, setIsFocused] = useState(true); const [interacted, setInteracted] = useState(false);

useEffect(() => { const handleFocus = () => setIsFocused(true); const handleBlur = () => setIsFocused(false); const handleInteraction = () => setInteracted(true);

window.addEventListener("focus", handleFocus);
window.addEventListener("blur", handleBlur);
window.addEventListener("scroll", handleInteraction);
window.addEventListener("click", handleInteraction);

const interval = setInterval(() => {
  const now = Date.now();
  if (isFocused && interacted && now - startTime >= minReadTime) {
    fetch("/api/log-real-hit", { method: "POST" });
    clearInterval(interval);
  }
}, 5000);

return () => {
  window.removeEventListener("focus", handleFocus);
  window.removeEventListener("blur", handleBlur);
  window.removeEventListener("scroll", handleInteraction);
  window.removeEventListener("click", handleInteraction);
  clearInterval(interval);
};

}, [startTime, isFocused, interacted]);

return { isFocused, interacted }; }

// pages/api/log-real-hit.ts export default async function handler(req, res) { if (req.method === "POST") { const { storyId, userId } = req.body; await saveHitToDB(storyId, userId); res.status(200).json({ success: true }); } else { res.status(405).end(); } }

// lib/auth.ts export const checkPremium = async (userId: string) => { const user = await getUserById(userId); return user?.premium === true; };

  
