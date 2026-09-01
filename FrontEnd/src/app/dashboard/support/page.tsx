"use client";

import { useState } from "react";
import {Search, Book, CreditCard, Monitor, User,MessageCircle, Mail, Phone, ChevronDown, ChevronUp} from "lucide-react";
import AiAssistant from "@/components/chat/AiAssistant";

export default function SupportPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { icon: User, title: "Account & Profile", desc: "Manage your details and security" },
        { icon: Book, title: "Courses & Learning", desc: "Progress, certificates, and content" },
        { icon: CreditCard, title: "Billing & Payments", desc: "Invoices, plans, and receipts" },
        { icon: Monitor, title: "Technical Issues", desc: "Troubleshooting and bug reports" },
    ];

    const faqs = [
        {
            question: "How do I download my course certificate?",
            answer: "Once you complete 100% of the course modules and pass the final assessment, your certificate will automatically appear in the 'Certificates' tab on your dashboard. You can download it as a high-resolution PDF."
        },
        {
            question: "Can I switch my learning plan after subscribing?",
            answer: "Yes, you can upgrade or downgrade your plan at any time from your Account Settings. If you upgrade, you'll be prorated for the remainder of the billing cycle. Downgrades take effect at the start of the next cycle."
        },
        {
            question: "Why is a video not loading properly?",
            answer: "Please ensure you have a stable internet connection (at least 5Mbps). If the issue persists, try clearing your browser cache or switching to a different browser like Chrome or Firefox. Also, check if your VPN is causing connectivity drops."
        },
        {
            question: "How do I contact an instructor?",
            answer: "You can reach out to instructors via the 'Messages' tab. Find the instructor in your directory and send them a direct message. Please allow 24-48 hours for a response."
        }
    ];

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">

                    How can we help you today?
                </h1>
                <p className="text-slate-500">Search our knowledge base or browse categories below to find exactly what you need.</p>
            </div>

            <div className="relative flex items-center w-full max-w-lg">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for articles, tutorials, or FAQs..."
                    className="w-full pl-16 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                />
            </div>

            {/* Categories Grid */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-slate-50 group-hover:bg-brand-50 rounded-xl flex items-center justify-center mb-4 transition-colors">
                                <cat.icon className="w-6 h-6 text-slate-600 group-hover:text-brand-600 transition-colors" />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2 group-hover:text-brand-700 transition-colors">{cat.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Two Column Layout for FAQs & Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* FAQs */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border-b border-slate-100 last:border-b-0">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors focus:outline-none"
                                >
                                    <span className="font-semibold text-slate-800">{faq.question}</span>
                                    {activeFaq === i ? (
                                        <ChevronUp className="w-5 h-5 text-brand-600 shrink-0 ml-4" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-4" />
                                    )}
                                </button>
                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Still need help?</h2>
                    <div className="space-y-4">
                        <div
                            onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
                            className="bg-brand-600 text-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <MessageCircle className="w-8 h-8 mb-4 opacity-90" />
                            <h3 className="font-bold text-lg mb-1">Live Chat</h3>
                            <p className="text-brand-100 text-sm mb-4">Available 24/7 for urgent issues</p>
                            <div className="inline-flex items-center text-sm font-semibold bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                Start Chatting (Coming Soon!)
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-200 transition-colors cursor-pointer group">
                            <Mail className="w-8 h-8 text-slate-400 group-hover:text-brand-500 transition-colors mb-4" />
                            <h3 className="font-bold text-slate-800 text-lg mb-1">Email Support</h3>
                            <p className="text-slate-500 text-sm mb-4">Expect a reply within 24 hours</p>
                            <div className="text-brand-600 text-sm font-semibold group-hover:text-brand-700">
                                support@asiasoftlab.com
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-200 transition-colors cursor-pointer group">
                            <Phone className="w-8 h-8 text-slate-400 group-hover:text-brand-500 transition-colors mb-4" />
                            <h3 className="font-bold text-slate-800 text-lg mb-1">Phone Support</h3>
                            <p className="text-slate-500 text-sm mb-4">Mon-Fri, 9am - 5pm IST</p>
                            <div className="text-brand-600 text-sm font-semibold group-hover:text-brand-700">
                                9745860278
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Global AI Assistant Instance for Support */}
            <AiAssistant />
        </div>
    );
}