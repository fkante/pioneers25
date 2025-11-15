import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import UseCases from './components/UseCases';
import LiveExamples from './components/LiveExamples';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-brand-light-bg font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <UseCases />
        <LiveExamples />
        <Features />
        <CallToAction />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;