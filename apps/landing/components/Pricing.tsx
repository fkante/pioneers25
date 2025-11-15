import React from 'react';

const Check = () => (
    <svg className="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
);

const PricingPlan: React.FC<{
    planName: string;
    price: string;
    description: string;
    features: string[];
    isFeatured: boolean;
}> = ({ planName, price, description, features, isFeatured }) => {
    const buttonClasses = isFeatured
        ? "w-full bg-gradient-to-r from-brand-purple to-brand-fuchsia text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-brand-purple/30 transition-all"
        : "w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all";

    if (isFeatured) {
        return (
            <div className="group perspective-[1000px]">
                <div className="relative bg-gradient-to-br from-brand-purple to-brand-fuchsia rounded-xl p-1 shadow-2xl shadow-brand-purple/20 transition-all duration-300 hover:shadow-brand-purple/40 hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)]">
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ease-in-out group-hover:left-full z-20 pointer-events-none" />
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-purple to-brand-fuchsia text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-20">Most Popular</div>
                    <div className='relative bg-white rounded-lg p-8 h-full z-10'>
                        <h3 className="text-2xl font-bold text-brand-dark-text">{planName}</h3>
                        <p className="text-brand-gray-text mt-2">{description}</p>
                        <div className="mt-6">
                            <span className="text-5xl font-extrabold text-brand-dark-text">{price}</span>
                            <span className="text-brand-gray-text">/ month</span>
                        </div>
                        <ul className="mt-8 space-y-4">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <Check />
                                    <span className="text-brand-dark-text">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`mt-10 ${buttonClasses}`}>
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Non-featured plan
    return (
        <div className="group perspective-[1000px]">
            <div className="relative bg-white rounded-xl border border-gray-200 h-full transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-brand-purple/20 hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)] hover:border-brand-purple/30">
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ease-in-out group-hover:left-full z-10 pointer-events-none" />
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-brand-dark-text">{planName}</h3>
                    <p className="text-brand-gray-text mt-2">{description}</p>
                    <div className="mt-6">
                        <span className="text-5xl font-extrabold text-brand-dark-text">{price}</span>
                        <span className="text-brand-gray-text">/ month</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-3">
                                <Check />
                                <span className="text-brand-dark-text">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button className={`mt-10 ${buttonClasses}`}>
                        Start Free Trial
                    </button>
                </div>
            </div>
        </div>
    );
};

const Pricing: React.FC = () => {
    return (
        <section id="pricing" className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark-text">
                        Simple, transparent <span className="bg-gradient-to-r from-brand-purple to-brand-fuchsia text-transparent bg-clip-text">pricing.</span>
                    </h2>
                    <p className="mt-4 text-lg text-brand-gray-text max-w-2xl mx-auto">Choose the plan that's right for your business. No hidden fees.</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                    <PricingPlan
                        planName="Starter"
                        price="$0"
                        description="For individuals and small businesses trying things out."
                        features={["50 calls/month", "1 agent", "Basic analytics", "Email support"]}
                        isFeatured={false}
                    />
                    <PricingPlan
                        planName="Pro"
                        price="$99"
                        description="For growing businesses that need more power and automation."
                        features={["500 calls/month", "3 agents", "Full analytics", "Calendar & CRM integrations", "Priority support"]}
                        isFeatured={true}
                    />
                    <PricingPlan
                        planName="Business"
                        price="$299"
                        description="For established businesses with high call volume."
                        features={["2000 calls/month", "Unlimited agents", "Advanced integrations", "Call recording", "Dedicated account manager"]}
                        isFeatured={false}
                    />
                </div>
            </div>
        </section>
    );
};

export default Pricing;