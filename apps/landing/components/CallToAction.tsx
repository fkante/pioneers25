import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section id="cta" className="py-12 md:py-20 bg-brand-light-bg">
      <div className="container mx-auto px-6">
        <div className="group perspective-[2000px]">
          <div className="bg-gradient-to-r from-brand-purple to-brand-fuchsia p-px rounded-2xl shadow-[10px_10px_40px_-10px_rgba(124,58,237,0.6)] transition-all duration-300 hover:[transform:rotateX(2deg)_rotateY(-2deg)]">
            <div className="relative bg-brand-light-bg rounded-[15px] p-10 md:p-16 text-center overflow-hidden">
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-700 ease-in-out group-hover:left-full z-10 pointer-events-none" />
              <div className="relative z-0">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark-text tracking-tight">
                  Experience vocalAIz AI instantly
                </h2>
                <p className="mt-4 text-lg text-brand-gray-text max-w-2xl mx-auto">
                  Join hundreds of businesses revolutionizing their customer service. Get started in
                  minutes.
                </p>
                <div className="mt-10">
                  <a
                    className="bg-gradient-to-r from-brand-purple to-brand-fuchsia text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 transition-all transform hover:scale-105"
                    href="http://localhost:5173"
                  >
                    Create an agent
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
