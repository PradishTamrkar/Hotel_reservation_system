import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqService } from "@services/api/api";

export const FAQSection = () => {
    const [faqs, setFaqs] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFAQ = async () => {
            try {
                setLoading(true);
                const data = await faqService.getAll();
                setFaqs(data || []);
            } catch (error) {
                console.error('Error fetching FAQs');
            } finally {
                setLoading(false);
            }
        };
        fetchFAQ();
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (loading) {
        return (
            <section id="faq" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-pulse text-lg text-gray-600">Loading FAQ...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (faqs.length === 0) {
        return null;
    }

    return (
        <section id="faq" className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* Centered Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our hotel and services
                    </p>
                </div>

                {/* Centered FAQ Box */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {faqs.map((faq, index) => (
                            <div key={faq.faq_id} className="transition-all duration-200">
                                {/* Question Button */}
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-primary/5 transition-colors text-left group"
                                >
                                    <span className="font-semibold text-base md:text-lg text-gray-900 pr-4 group-hover:text-primary transition-colors">
                                        {faq.faq_questions}
                                    </span>
                                    <div className="flex-shrink-0">
                                        {openIndex === index ? (
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <ChevronUp className="w-5 h-5 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                                                <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Answer */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-6 md:px-8 py-6 bg-primary/5">
                                        <p className="text-gray-700 leading-relaxed">
                                            {faq.faq_answers}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};