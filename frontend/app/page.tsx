"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Item {
  _id: string;
  name: string;
  score?: number;
  rating?: number;
  globalPopularity?: number;
  image?: string;
  description?: string;
}

export default function Home() {
  const [artists, setArtists] = useState<Item[]>([]);
  const [beauty, setBeauty] = useState<Item[]>([]);
  const [snacks, setSnacks] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        const [artistRes, beautyRes, snackRes] = await Promise.all([
          fetch(`${baseUrl}/api/artists`),
          fetch(`${baseUrl}/api/beauty`),
          fetch(`${baseUrl}/api/snacks`)
        ]);

        const artistData = await artistRes.json();
        const beautyData = await beautyRes.json();
        const snackData = await snackRes.json();

        setArtists(artistData.data?.slice(0, 6) || []);
        setBeauty(beautyData.data?.slice(0, 6) || []);
        setSnacks(snackData.data?.slice(0, 6) || []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🎌 K-Culture Daily
            </h1>
            <nav className="flex gap-6 text-sm">
              <Link href="/kpop" className="hover:text-cyan-400 transition">K-POP</Link>
              <Link href="/beauty" className="hover:text-pink-400 transition">K-Beauty</Link>
              <Link href="/snack" className="hover:text-yellow-400 transition">K-Snack</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* K-POP 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              <span className="text-2xl mr-2">🎤</span>
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                This Week's Hidden Gems
              </span>
            </h2>
            <Link href="/kpop" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View all →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-400">로딩 중...</div>
          ) : artists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist) => (
                <div
                  key={artist._id}
                  className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6 hover:border-pink-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="mb-4 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-4xl">
                    🎤
                  </div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">{artist.name}</h3>
                  <div className="text-sm text-gray-400">
                    <div>⭐ Score: {artist.score?.toFixed(0)}/100</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">데이터 없음</div>
          )}
        </section>

        {/* K-Beauty 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              <span className="text-2xl mr-2">💄</span>
              <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                K-Beauty Latest
              </span>
            </h2>
            <Link href="/beauty" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View all →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-400">로딩 중...</div>
          ) : beauty.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beauty.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6 hover:border-pink-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="mb-4 h-32 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-4xl">
                    💄
                  </div>
                  <h3 className="text-lg font-bold text-pink-400 mb-2">{product.name}</h3>
                  <div className="text-sm text-gray-400">
                    <div>⭐ Rating: {product.rating?.toFixed(1)}/5</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">데이터 없음</div>
          )}
        </section>

        {/* K-Snack 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              <span className="text-2xl mr-2">🍿</span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                K-Snack Popular
              </span>
            </h2>
            <Link href="/snack" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View all →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-400">로딩 중...</div>
          ) : snacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {snacks.map((snack) => (
                <div
                  key={snack._id}
                  className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6 hover:border-yellow-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="mb-4 h-32 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-4xl">
                    🍿
                  </div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">{snack.name}</h3>
                  <div className="text-sm text-gray-400">
                    <div>⭐ Rating: {snack.rating?.toFixed(1)}/5</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">데이터 없음</div>
          )}
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-white/10 bg-[#0f172a]/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 K-Culture Daily. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
