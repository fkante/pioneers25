import { Link, useRouterState } from '@tanstack/react-router';

import { useState } from 'react';

const navItems = [
  { label: 'Prebuilt Agents', to: '/' },
  { label: 'Use Cases', to: '/solutions' },
  { label: 'Custom Builder', to: '/agents' },
  { label: 'Live Test', to: '/console' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { location } = useRouterState();

  const isActive = (to: string) => {
    if (to === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#dbe3eb] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold text-[#0d1821]">
          vocal<span className="text-[#344966]">AI</span>z
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#4d5c6d] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`transition-colors hover:text-[#344966] ${isActive(item.to) ? 'text-[#344966]' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            className="rounded-full border border-[#dbe3eb] p-2 text-[#344966] shadow-sm"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[#dbe3eb] bg-white/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-[#4d5c6d]">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl border px-3 py-2 text-left transition hover:text-[#344966] ${isActive(item.to) ? 'border-[#344966] text-[#344966]' : 'border-transparent'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6l-12 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
