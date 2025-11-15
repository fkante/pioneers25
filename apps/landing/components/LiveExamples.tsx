import React from 'react';

const TranscriptLine: React.FC<{ speaker: 'Customer' | 'Agent'; children: React.ReactNode }> = ({ speaker, children }) => {
  const isAgent = speaker === 'Agent';
  return (
    <p className="text-brand-gray-text">
      <span className={`font-semibold ${isAgent ? 'text-brand-purple' : 'text-brand-dark-text'}`}>
        {speaker}:
      </span>{' '}
      {children}
    </p>
  );
};

const LiveIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="relative flex h-3 w-3">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <span className="text-red-500 font-semibold text-sm">LIVE</span>
    </div>
);


const DemoCard: React.FC<{ title: string, scenario: React.ReactNode }> = ({ title, scenario }) => (
  <div className="group perspective-[1000px]">
    <div className="relative bg-white border border-gray-200 rounded-2xl h-full transition-all duration-300 hover:shadow-2xl hover:shadow-brand-purple/30 hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)] hover:border-brand-purple/30 overflow-hidden">
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-700 ease-in-out group-hover:left-full z-10 pointer-events-none" />
        <div className="p-6 bg-gray-50/70 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-brand-purple" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <h4 className="font-bold text-brand-dark-text text-xl">{title}</h4>
                </div>
                <LiveIndicator />
            </div>
        </div>
        <div className="p-6 space-y-3">
            {scenario}
        </div>
    </div>
  </div>
);


const LiveExamples: React.FC = () => {
  return (
    <section id="examples" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark-text">
            See it in <span className="bg-gradient-to-r from-brand-purple to-brand-fuchsia text-transparent bg-clip-text">action</span>
          </h2>
          <p className="mt-4 text-lg text-brand-gray-text max-w-2xl mx-auto">Actual examples from businesses that use vocalAIz every day.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <DemoCard 
            title="Restaurant Booking"
            scenario={
              <>
                <TranscriptLine speaker="Customer">Hi, I'd like to book a table for 2 tonight.</TranscriptLine>
                <TranscriptLine speaker="Agent">Of course! What time would you prefer?</TranscriptLine>
                <TranscriptLine speaker="Customer">Around 8pm please.</TranscriptLine>
                <TranscriptLine speaker="Agent">Perfect. I have a table for two at 8pm. Can I get a name for the booking?</TranscriptLine>
                <TranscriptLine speaker="Customer">It's for Sarah.</TranscriptLine>
                <TranscriptLine speaker="Agent">Great, Sarah. You're all set for tonight at 8pm. We look forward to seeing you!</TranscriptLine>
              </>
            }
          />
          <DemoCard 
            title="Garage Repair"
            scenario={
              <>
                <TranscriptLine speaker="Customer">My car is making a weird rattling noise.</TranscriptLine>
                <TranscriptLine speaker="Agent">I can help with that. Is the noise more from the engine or underneath the car?</TranscriptLine>
                <TranscriptLine speaker="Customer">I think it's the engine. Can I bring it in tomorrow?</TranscriptLine>
                <TranscriptLine speaker="Agent">Yes, we have an opening at 10am or 2pm. Which works better for you?</TranscriptLine>
                <TranscriptLine speaker="Customer">10am is perfect.</TranscriptLine>
                <TranscriptLine speaker="Agent">Booked in. We'll see you and your car tomorrow at 10am.</TranscriptLine>
              </>
            }
          />
          <DemoCard 
            title="Medical Appointment"
            scenario={
              <>
                <TranscriptLine speaker="Customer">I need to schedule my annual check-up.</TranscriptLine>
                <TranscriptLine speaker="Agent">Certainly. Dr. Evans is available next Tuesday and Thursday. Do you have a preference?</TranscriptLine>
                <TranscriptLine speaker="Customer">Tuesday morning would be best.</TranscriptLine>
                <TranscriptLine speaker="Agent">We have a 9:30am slot available. Shall I book that for you?</TranscriptLine>
                <TranscriptLine speaker="Customer">Yes, please.</TranscriptLine>
                <TranscriptLine speaker="Agent">You're confirmed for Tuesday at 9:30am. You'll receive a reminder text the day before.</TranscriptLine>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default LiveExamples;