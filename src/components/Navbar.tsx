const links = [
  { label: "Home", href: "#", active: true },
  { label: "About", href: "#" },
  { label: "Gallery", href: "#" },
  { label: "Contact", href: "#" },
];

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M5 11 11 5M6 5h5v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-[17px] w-[17px]">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <nav className="mx-auto flex h-[60px] max-w-[1320px] items-center justify-between rounded-[18px] border border-white/15 bg-white/[0.06] pl-5 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150 md:h-[72px] md:pl-7">
        <div className="flex items-center">
          <a href="#" className="text-[17px] font-bold tracking-[-0.04em] md:text-[19px]">
            <span className="text-white">keturah</span>
            <span className="text-white/55">hamilton.</span>
          </a>
          <span className="mx-8 hidden h-10 w-px bg-white/15 lg:block" />
          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className={`text-[15px] font-medium transition-colors ${
                    l.active ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://www.instagram.com/keturahhamilton/"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 text-[15px] font-medium text-white/75 transition-colors hover:text-white md:flex"
          >
            <InstagramIcon />
            @keturahhamilton
          </a>
          <a
            href="#"
            className="group flex h-11 items-center gap-3 rounded-full bg-white pl-5 pr-1.5 text-[14px] font-semibold text-[#141414] md:h-12 md:pl-6 md:text-[15px]"
          >
            Book Keturah
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#141414] text-white transition-transform group-hover:rotate-45 md:h-9 md:w-9">
              <ArrowIcon className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}
