import React from 'react';

const benefits = [
    { 
        title: 'Never miss a call again', 
        description: 'Capture every opportunity, even when you\'re busy or closed.',
        className: 'md:col-span-2',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 10.035A10.5 10.5 0 112.98 4.02" /></svg>
    },
    { 
        title: '24/7 Availability', 
        description: 'Your business is always open for calls, day or night.',
        className: '',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
        title: 'Perfectly tailored to you', 
        description: 'The AI learns your business for natural, relevant conversations.',
        className: '',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    },
    { 
        title: 'Seamless integration', 
        description: 'Works with your existing calendars and CRMs.',
        className: 'md:col-span-2',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
    },
];

const BenefitCard: React.FC<{ title: string; description: string; className: string, icon: React.ReactNode }> = ({ title, description, className, icon }) => (
    <div className={`bg-white border border-gray-200 p-6 rounded-xl shadow-sm ${className}`}>
        <div className="text-brand-purple mb-3">
            {icon}
        </div>
        <h4 className="text-lg font-bold text-brand-dark-text">{title}</h4>
        <p className="mt-1 text-brand-gray-text">{description}</p>
    </div>
);

const Benefits: React.FC = () => {
  return (
    <section id="benefits" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text">The smartest way to handle calls.</h2>
          <p className="mt-4 text-lg text-brand-gray-text max-w-3xl mx-auto">VoxAgent isn't just an answering machine. It's an intelligent part of your team that drives growth and efficiency.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            {benefits.map(benefit => <BenefitCard key={benefit.title} {...benefit} />)}
        </div>
      </div>
    </section>
  );
};

export default Benefits;