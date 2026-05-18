"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المميزات", href: "#features" },
  { label: "التجار", href: "/merchant" },
  { label: "الوكلاء", href: "/agents" },
  { label: "المدونة", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#070c15]/95 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">
              Kaza<span className="text-blue-400">Wallet</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">ابدأ مجاناً</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="فتح القائمة"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#070c15]/98 backdrop-blur-xl border-b border-white/5 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-4">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                تسجيل الدخول
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                ابدأ مجاناً
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
