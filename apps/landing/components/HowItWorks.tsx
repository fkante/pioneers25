import React from 'react';

const StepCard: React.FC<{
  step: string;
  title: string;
  description: string;
}> = ({ step, title, description }) => (
  <div className="group perspective-[1000px] h-full">
    <div className="relative bg-white border border-gray-200 h-full p-8 rounded-xl flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-purple/20 hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)] hover:border-brand-purple/30">
      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-all duration-500 ease-in-out group-hover:left-[150%] pointer-events-none"/>
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-brand-purple to-brand-fuchsia text-white rounded-full text-xl font-bold">
        {step}
      </div>
      <h3 className="mt-4 text-xl font-bold text-brand-dark-text">{title}</h3>
      <p className="mt-2 text-brand-gray-text">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark-text">
            Insanely <span className="bg-gradient-to-r from-brand-purple to-brand-fuchsia text-transparent bg-clip-text">simple</span> to get started
          </h2>
          <p className="mt-4 text-lg text-brand-gray-text max-w-2xl mx-auto">Create and launch your AI phone agent in three simple steps to optimize your call management and make sure you don't miss any opportunity anymore !</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <StepCard
            step="1"
            title="Describe your business"
            description="Provide essential details like your name, services, opening hours, and specific rules for your agent."
          />
          <StepCard
            step="2"
            title="Generate your AI agent"
            description="Our AI learns everything from your info and website to build a custom-trained agent just for you."
          />
          <StepCard
            step="3"
            title="Go live & receive calls"
            description="Get your dedicated phone number. Your agent is now live, handling calls and updating your systems 24/7."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;