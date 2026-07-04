import { NextResponse } from "next/server"

interface InstagramPost {
  id: string
  mediaUrl: string
  permalink: string
  caption: string
  timestamp: string
}

const USERNAME = "pulsamodafitness"
const BASE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
}

async function fetchFromBasicDisplay(token: string): Promise<InstagramPost[]> {
  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp&access_token=${token}&limit=8`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.data ?? []).map((item: any) => ({
    id: item.id,
    mediaUrl: item.media_url,
    permalink: item.permalink,
    caption: item.caption ?? "",
    timestamp: item.timestamp,
  }))
}

async function fetchFromHTML(): Promise<InstagramPost[]> {
  const res = await fetch(`https://www.instagram.com/${USERNAME}/`, {
    headers: {
      ...BASE_HEADERS,
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
    next: { revalidate: 3600 },
  })

  if (!res.ok) return []

  const html = await res.text()

  const match = html.match(
    /<script[^>]*>window\.__INITIAL_STATE__\s*=\s*({.+?});\s*<\/script>/
  )

  if (!match) return []

  try {
    const data = JSON.parse(match[1])
    const media =
      data?.user?.edge_owner_to_timeline_media?.edges ??
      data?.profilePageData?.user?.edge_owner_to_timeline_media?.edges ??
      []

    return media.slice(0, 8).map((edge: any) => ({
      id: edge.node.id,
      mediaUrl: edge.node.display_url,
      permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
      caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text ?? "",
      timestamp: edge.node.taken_at_timestamp,
    }))
  } catch {
    return []
  }
}

async function fetchFromRSSHub(): Promise<InstagramPost[]> {
  const urls = [
    `https://rsshub.app/instagram/user/${USERNAME}`,
    `https://rsshub.sapphire.icu/instagram/user/${USERNAME}`,
  ]

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: BASE_HEADERS,
        next: { revalidate: 3600 },
      })
      if (!res.ok) continue

      const html = await res.text()

      // RSSHub renders images in item description
      const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
      const linkRegex = /<link[^>]*href="([^"]+)"[^>]*>/g
      const titleRegex = /<title>([^<]+)<\/title>/g

      const images: string[] = []
      const links: string[] = []
      const titles: string[] = []

      let m
      while ((m = imgRegex.exec(html)) !== null) {
        if (m[1].includes("cdninstagram")) images.push(m[1])
      }
      while ((m = linkRegex.exec(html)) !== null) {
        if (m[1].includes("instagram.com/p/")) links.push(m[1])
      }
      while ((m = titleRegex.exec(html)) !== null) {
        titles.push(m[1])
      }

      if (images.length === 0) continue

      return images.slice(0, 8).map((imgUrl, i) => ({
        id: String(i),
        mediaUrl: imgUrl,
        permalink: links[i] ?? `https://www.instagram.com/${USERNAME}/`,
        caption: titles[i] ?? "",
        timestamp: String(Date.now()),
      }))
    } catch {
      continue
    }
  }

  return []
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  let posts: InstagramPost[] = []

  if (token) {
    posts = await fetchFromBasicDisplay(token)
  }

  if (posts.length === 0) {
    posts = await fetchFromHTML()
  }

  if (posts.length === 0) {
    posts = await fetchFromRSSHub()
  }

  return NextResponse.json({ posts })
}
