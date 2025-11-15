import React from 'react';

const RestaurantIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 21h10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11v10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7c3.125-2.25 4.81-2.025 6-2 1.488.03 2.158 1.125 2 2-.15 1.15-.85 2.5-2 3-1.15.5-2.5 1-4 1s-2.85-.5-4-1c-1.15-.5-1.85-1.85-2-3 .158-1.125.512-1.97 2-2 1.19-.025 2.875.25 6 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HotelIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8.5h20" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 16.5h1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 16.5h1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12.5v-4H3v8h7" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 20.5h7V12l-7-3v11.5z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 20.5h11" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const GarageIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.56 10.979l-1.428-4.285A2 2 0 0018.28 5H5.72a2 2 0 00-1.852 1.694l-1.428 4.285A2 2 0 003 12v5a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-.44-1.021z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MedicalIcon = () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5.25v13.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.25 12h13.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const BusinessIcon = () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-4 7 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const UseCaseCard: React.FC<{ title: string; description: string[]; icon: React.ReactNode; }> = ({ title, description, icon }) => (
  <div className="group perspective-[1000px]">
    <div className="bg-white border border-gray-200 rounded-xl h-full p-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-purple/20 hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)] hover:border-brand-purple/30">
      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ease-in-out group-hover:left-full pointer-events-none" />
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-brand-purple to-brand-fuchsia text-white rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-brand-dark-text">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2">
        {description.map((item, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-brand-purple mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-brand-gray-text">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const UseCases: React.FC = () => {
  return (
    <section id="use-cases" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark-text">
            Adapted to <span className="bg-gradient-to-r from-brand-purple to-brand-fuchsia text-transparent bg-clip-text">any business</span>
          </h2>
          <p className="mt-4 text-lg text-brand-gray-text max-w-2xl mx-auto">Whatever your business, your AI phone agent adapts instantly to your rules, your workflows, and your customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UseCaseCard 
            title="Restaurants" 
            icon={<RestaurantIcon />}
            description={["Handles reservations & cancellations", "Answers menu & opening hours questions", "Takes pre-orders and special requests"]}
          />
          <UseCaseCard 
            title="Hotels / BnB"
            icon={<HotelIcon />}
            description={["Books rooms and checks availability", "Handles check-in/out questions", "Provides info on amenities & attractions"]}
          />
          <UseCaseCard 
            title="Garages"
            icon={<GarageIcon />}
            description={["Books repair and service appointments", "Pre-qualifies the vehicle's problem", "Sends reminders for upcoming services"]}
          />
          <UseCaseCard 
            title="Medical & Health"
            icon={<MedicalIcon />}
            description={["Books patient consultation slots", "Gives pre-appointment instructions", "Handles rescheduling & reminders"]}
          />
          <UseCaseCard 
            title="Salons & Spas"
            icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 15.879l-1.414 1.414a2 2 0 01-2.828 0l-1.414-1.414a2 2 0 010-2.828l3.535-3.536a2 2 0 012.828 0l.707.707M14.828 8.414a2 2 0 010 2.828l-4.242 4.243a2 2 0 01-2.828-2.828l4.242-4.243a2 2 0 012.828 0z" /></svg>}
            description={["Schedules appointments for services", "Answers questions on pricing & duration", "Manages stylist/therapist availability"]}
          />
          <UseCaseCard 
            title="Any Business"
            icon={<BusinessIcon />}
            description={["Qualifies leads with screening questions", "Answers frequently asked questions", "Routes complex calls to a human agent"]}
          />
        </div>
      </div>
    </section>
  );
};

export default UseCases;