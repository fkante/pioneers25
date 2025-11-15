import React from 'react';

const CallIconButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isEndCall?: boolean;
  isDisabled?: boolean;
}> = ({ icon, label, isEndCall = false, isDisabled = false }) => {
  const buttonClasses = isEndCall ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30';

  const textClasses = isDisabled ? 'text-gray-500' : 'text-white';

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${buttonClasses}`}
        disabled={isDisabled}
      >
        {icon}
      </button>
      <span className={`text-sm font-medium ${textClasses}`}>{label}</span>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden !pt-40 pb-12 md:pt-40 md:pb-20">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark-text tracking-tight leading-tight animate-fade-in-up">
          Your AI phone agent.
          <span className="block bg-gradient-to-r from-brand-purple to-brand-fuchsia text-transparent bg-clip-text pb-2">
            Ready in 2 minutes.
          </span>
        </h1>
        <p
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-brand-gray-text animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          Enter your business info, get a phone number, and let an AI agent handle all your calls,
          24/7.
        </p>

        <div
          className="mt-8 max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-x-12 gap-y-4 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-6 h-6 bg-brand-dark-text rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <span className="font-semibold text-brand-dark-text">24/7</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-6 h-6 bg-brand-dark-text rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <span className="font-semibold text-brand-dark-text">Natural Conversations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-6 h-6 bg-brand-dark-text rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <span className="font-semibold text-brand-dark-text">Deploy in 2 minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-6 h-6 bg-brand-dark-text rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <span className="font-semibold text-brand-dark-text">Multi languages</span>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <a
            href="http://localhost:5173"
            className="w-full sm:w-auto bg-gradient-to-r from-brand-purple to-brand-fuchsia text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 transition-all transform hover:scale-105"
          >
            Create my agent
          </a>
        </div>
      </div>

      <div
        className="relative container mx-auto px-6 mt-16 md:mt-24 animate-fade-in-up"
        style={{ animationDelay: '0.6s' }}
      >
        <div className="relative mx-auto border-black bg-black border-[14px] rounded-[2.5rem] h-[630px] w-[310px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),_0_0_25px_rgba(124,58,237,0.2)] ring-1 ring-white/10">
          {/* Side buttons with highlights */}
          {/* Volume buttons */}
          <div className="h-[40px] w-[4px] bg-gray-800 absolute -left-[18px] top-[112px] rounded-l-lg ring-1 ring-inset ring-gray-500/50" />
          <div className="h-[40px] w-[4px] bg-gray-800 absolute -left-[18px] top-[162px] rounded-l-lg ring-1 ring-inset ring-gray-500/50" />
          {/* Power button */}
          <div className="h-[64px] w-[4px] bg-gray-800 absolute -right-[18px] top-[142px] rounded-r-lg ring-1 ring-inset ring-gray-500/50" />

          <div className="w-[140px] h-[22px] bg-black top-0 rounded-b-xl left-1/2 -translate-x-1/2 absolute z-10"></div>
          <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#1C1C1E] shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)]">
            <div className="h-full flex flex-col justify-between items-center p-6 pt-12 text-white">
              {/* Caller Info */}
              <div
                className="text-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.8s' }}
              >
                <p className="text-3xl font-semibold">Nautica</p>
                <p className="text-gray-400 mt-1 text-lg">00:14</p>
              </div>

              {/* Transcript and Voice Wave */}
              <div className="text-center">
                <p
                  className="text-gray-300 text-lg px-4 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: '0.9s' }}
                >
                  "Good evening! Alexandre from Nautica restaurant, how can I help you ?"
                </p>
                <div
                  className="flex items-end justify-center space-x-1.5 h-20 mt-4 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: '1s' }}
                >
                  <span
                    className="w-2 h-4 bg-brand-fuchsia/80 rounded-full animate-voice-wave origin-bottom"
                    style={{ animationDelay: '-0.4s' }}
                  ></span>
                  <span
                    className="w-2 h-8 bg-brand-fuchsia/80 rounded-full animate-voice-wave origin-bottom"
                    style={{ animationDelay: '-0.2s' }}
                  ></span>
                  <span className="w-2 h-12 bg-brand-fuchsia rounded-full animate-voice-wave origin-bottom"></span>
                  <span
                    className="w-2 h-8 bg-brand-fuchsia/80 rounded-full animate-voice-wave origin-bottom"
                    style={{ animationDelay: '0.2s' }}
                  ></span>
                  <span
                    className="w-2 h-4 bg-brand-fuchsia/80 rounded-full animate-voice-wave origin-bottom"
                    style={{ animationDelay: '0.4s' }}
                  ></span>
                </div>
              </div>

              {/* Controls */}
              <div
                className="w-full grid grid-cols-3 gap-y-8 pb-4 opacity-0 animate-fade-in-up"
                style={{ animationDelay: '1.1s' }}
              >
                <CallIconButton
                  label="Speaker"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  }
                />
                <CallIconButton
                  label="FaceTime"
                  isDisabled
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                    </svg>
                  }
                />
                <CallIconButton
                  label="Mute"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 12 6.7 9H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                    </svg>
                  }
                />
                <CallIconButton
                  label="Add"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 8c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-2-2h-2v2H9v2h2v2h2v-2h2V8h-2V6zm-3 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  }
                />
                <CallIconButton
                  label="End"
                  isEndCall
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white transform rotate-[135deg]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  }
                />
                <CallIconButton
                  label="Keypad"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="6" cy="6" r="2" />
                      <circle cx="12" cy="6" r="2" />
                      <circle cx="18" cy="6" r="2" />
                      <circle cx="6" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="18" cy="12" r="2" />
                      <circle cx="6" cy="18" r="2" />
                      <circle cx="12" cy="18" r="2" />
                      <circle cx="18" cy="18" r="2" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
