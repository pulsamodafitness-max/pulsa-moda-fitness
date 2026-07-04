"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Instagram } from "@/components/ui/icons"

interface InstagramPost {
  id: string
  mediaUrl: string
  permalink: string
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.posts?.length > 0) {
          setPosts(data.posts.slice(0, 4))
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const placeholders = Array.from({ length: 4 }, (_, i) => ({ id: i + 1 }))

  return (
    <section className="bg-[#f7f7f7] border-b border-[#eee]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.15em] text-[#999] mb-1">Siga-nos</p>
          <Link
            href="https://www.instagram.com/pulsamodafitness/"
            target="_blank"
            className="text-lg sm:text-xl font-semibold text-[#1a1a1a] hover:text-[#d4a5a5] transition-colors no-underline"
          >
            @pulsamodafitness
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto">
          {loading
            ? placeholders.map((p) => (
                <div
                  key={p.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-[#e0e0e0] animate-pulse flex items-center justify-center"
                >
                  <Instagram size={32} className="text-[#ccc]" />
                </div>
              ))
            : posts.length > 0
              ? posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square overflow-hidden rounded-lg group"
                  >
                    <Image
                      src={post.mediaUrl}
                      alt="Instagram Pulsa Fit"
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Instagram size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </a>
                ))
            : placeholders.map((p) => (
                <a
                  key={p.id}
                  href="https://www.instagram.com/pulsamodafitness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#f77737] flex items-center justify-center group"
                >
                  <Instagram size={32} className="text-white/80 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
        </div>
      </div>
    </section>
  )
}
