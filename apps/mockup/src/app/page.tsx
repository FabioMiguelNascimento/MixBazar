import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function HomePage() {
  return (
    <Link href="/home" className="flex items-center gap-2 text-lg font-semibold text-primary">
      <span>Go to Home</span>
      <ArrowRight size={20} weight="bold" />
    </Link>
  )
}