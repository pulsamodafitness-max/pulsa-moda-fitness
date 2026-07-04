import Link from "next/link"

export function NavbarLogo() {
  return (
    <Link href="/" className="no-underline select-none" aria-label="Pulsa Fit - Home">
      <span
        style={{
          fontFamily: "'Lora', serif",
          fontSize: 22,
          fontWeight: 700,
          color: "#1a1a1a",
          letterSpacing: "-0.5px",
          lineHeight: 1,
          display: "block",
        }}
      >
        PULSA
      </span>
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "1.5px",
          color: "#999",
          display: "block",
          marginTop: 1,
        }}
      >
        MODA FITNESS
      </span>
    </Link>
  )
}
