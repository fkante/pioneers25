import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold text-white">
          frontend@frontend
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link
            to="/"
            className="rounded-md px-3 py-1 font-medium text-white transition hover:bg-slate-800"
            activeProps={{
              className: 'rounded-md px-3 py-1 font-semibold bg-slate-800 text-white',
            }}
          >
            Home
          </Link>

          <a
            className="rounded-md px-3 py-1 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            href="http://localhost:3000/api"
            target="_blank"
            rel="noreferrer"
          >
            Backend API
          </a>
        </nav>
      </div>
    </header>
  );
}
