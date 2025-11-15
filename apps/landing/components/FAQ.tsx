import React, { useState } from 'react';

const FaqItem: React.FC<{ question: string; children: React.ReactNode; isOpen: boolean; onClick: () => void; }> = ({ question, children, isOpen, onClick }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:border-brand-purple/50 hover:shadow-lg hover:shadow-brand-purple/10 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ease-in-out group-hover:left-full z-10 pointer-events-none" />
            <dt className="relative z-0">
                <button onClick={onClick} className="w-full flex justify-between items-start text-left p-6">
                    <span className="text-lg font-medium text-brand-dark-text">{question}</span>
                    <span className="ml-6 h-7 flex items-center text-brand-purple">
                        <svg className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? '-rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                </button>
            </dt>
            <dd className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 text-base text-brand-gray-text relative z-0">
                    {children}
                </div>
            </dd>
        </div>
    );
};

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "How long does it really take to set up?",
            a: "It's genuinely fast. If you have your business information ready (services, hours, etc.), you can generate your agent, get a phone number, and be ready to receive calls in about 2 minutes."
        },
        {
            q: "Can the AI understand different accents and languages?",
            a: "Yes. Our AI is trained on a vast dataset of languages and accents, allowing it to understand and respond to a wide variety of callers. We support over 20 languages out of the box."
        },
        {
            q: "What happens if the AI can't answer a question?",
            a: "You can configure a 'fallback' option. If the AI agent is unable to handle a specific request or recognizes complexity, it can seamlessly transfer the call to a human representative of your choice."
        },
        {
            q: "Can I use my existing business phone number?",
            a: "Yes, you can port your existing number to vocalAIz. Alternatively, you can forward calls from your current number to the new one provided by us. The choice is yours."
        },
        {
            q: "How does the AI learn about my business?",
            a: "You provide the core information through a simple form. For deeper knowledge, you can provide your website URL, and our AI will automatically read and learn from it to answer more specific questions."
        },
        {
            q: "What integrations do you support?",
            a: "We support a wide range of popular tools. Our key integrations include Google Calendar, Microsoft Outlook, Salesforce, HubSpot, and Notion. We are constantly adding more based on user feedback."
        },
    ];
    
    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark-text">
                            Frequently Asked <span className="bg-gradient-to-r from-brand-purple to-brand-fuchsia text-transparent bg-clip-text">Questions</span>
                        </h2>
                        <p className="mt-4 text-lg text-brand-gray-text">Have questions? We have answers. If you don't see your question here, feel free to contact us.</p>
                    </div>
                    <dl className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FaqItem
                                key={index}
                                question={faq.q}
                                isOpen={openIndex === index}
                                onClick={() => handleToggle(index)}
                            >
                                {faq.a}
                            </FaqItem>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
};

export default FAQ;