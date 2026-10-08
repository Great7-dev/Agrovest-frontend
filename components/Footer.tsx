export default function Footer() {
  return (
    <footer className="-mb-6 ml-[calc(50%-50vw)] mt-12 w-screen bg-leaf text-cream">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-lg border border-cream/15 bg-cream p-1">
              <img
                src="/logo.jpg"
                alt="Agrovest"
                className="h-10 w-10 rounded-md object-cover"
              />
            </div>

            <div>
              <p className="font-bold tracking-tight">Agrovest</p>
              <p className="text-xs text-cream/50">Farm to fork, proven.</p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 text-xs text-cream/60">
            <a href="/about" className="transition-colors hover:text-cream">
              About
            </a>
            <a href="/farmers" className="transition-colors hover:text-cream">
              Farmers
            </a>
            <a href="/contact" className="transition-colors hover:text-cream">
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Agrovest
          </p>
        </div>

        {/* Small signature line */}
        <div className="mt-5 border-t border-cream/10 pt-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/30">
            Every harvest sealed · Every handoff proven
          </p>
        </div>
      </div>
    </footer>
  );
}
