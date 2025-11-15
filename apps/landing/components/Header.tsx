import React from 'react';

const VocalAIzLogo = () => (
  <div className="flex items-center gap-2 relative bottom-0.5">
    <svg className="h-6 w-auto" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.2 24H9.6L0 14.4V9.6L9.6 0H13.2L3.6 9.6V14.4L13.2 24Z" fill="white" />
      <path d="M21.6 24H25.2L15.6 14.4V9.6L25.2 0H21.6L12 9.6V14.4L21.6 24Z" fill="white" />
    </svg>
    <span className="text-2xl font-bold tracking-tight text-white">vocalAIz</span>
    <span className="text-white text-xs font-semibold relative" style={{ top: '-0.5em' }}>
      AI
    </span>
  </div>
);

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 pt-8 px-6">
      <div className="container mx-auto">
        <div className="bg-[#0B0C1E] rounded-full shadow-2xl shadow-black/20 flex justify-between items-center px-7 py-5">
          <VocalAIzLogo />
          <nav className="hidden md:flex items-center space-x-8 text-lg font-medium">
            <a href="#" className="text-white transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
          </nav>
          <a
            href="http://localhost:5173"
            className="bg-gradient-to-r from-brand-purple to-brand-fuchsia text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 transition-all transform hover:scale-105 whitespace-nowrap"
          >
            Create my agent
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
