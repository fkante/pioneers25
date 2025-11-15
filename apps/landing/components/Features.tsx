import React from 'react';

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => {
  return (
    <div className="group perspective-[1000px] h-full">
        <div className="relative bg-white border border-gray-200 rounded-xl h-full p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple/20 hover:[transform:rotateX(5deg)_rotateY(-5deg)] hover:border-brand-purple/30 overflow-hidden">
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ease-in-out group-hover:left-full z-10 pointer-events-none" />
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-brand-purple to-brand-fuchsia text-white rounded-lg">
                {icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-text">{title}</h3>
                <p className="mt-1 text-brand-gray-text">{children}</p>
              </div>
            </div>
        </div>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <section id="features" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 lg:gap-16 items-center">
          <div className="lg:col-span-1 text-center lg:text-left mb-12 lg:mb-0">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark-text">
              How vocalAIz makes the difference in your <span className="bg-gradient-to-r from-brand-purple to-brand-fuchsia text-transparent bg-clip-text">business</span>
            </h2>
            <p className="mt-4 text-lg text-brand-gray-text">Powerful features designed for simplicity and performance.</p>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
            <FeatureItem
              title="No-Code Agent Generator"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>}
            >
              Our intuitive interface lets you build and launch your agent in minutes.
            </FeatureItem>
            <FeatureItem
              title="Knowledge Extraction"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            >
              Point to your website, and the AI will automatically learn about your business.
            </FeatureItem>
            <FeatureItem
              title="CRM & Calendar Integrations"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>}
            >
              Connect to Google Calendar, Notion, Salesforce, and more.
            </FeatureItem>
            <FeatureItem
              title="Multilingual Support"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4.28 10.28a11.957 11.957 0 01-8.56 0M12 21V11M3 11a9 9 0 0118 0v10M12 3a9 9 0 015.657 15.657"></path></svg>}
            >
              Serve a diverse customer base with agents that speak multiple languages.
            </FeatureItem>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;