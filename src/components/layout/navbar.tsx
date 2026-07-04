"use client"

import dynamic from "next/dynamic"
import { DesktopNavbar } from "./desktop-navbar"

const MobileNavbar = dynamic(
  () => import("./mobile/mobile-navbar").then((m) => m.MobileNavbar),
  { ssr: false }
)

export function Navbar() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopNavbar />
      </div>
      <div className="block lg:hidden sticky top-0 z-50 bg-white">
        <MobileNavbar />
      </div>
    </>
  )
}
