import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-brand-dark-text">vocalAIz</span>
            <p className="text-brand-gray-text">© {new Date().getFullYear()} vocalAIz Inc. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-brand-gray-text hover:text-brand-dark-text transition-colors">Twitter</a>
            <a href="#" className="text-brand-gray-text hover:text-brand-dark-text transition-colors">LinkedIn</a>
            <a href="#" className="text-brand-gray-text hover:text-brand-dark-text transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;