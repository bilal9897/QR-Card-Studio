import { Link } from "react-router-dom";
import { ArrowRight, QrCode } from "lucide-react";

import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0] flex flex-col font-sans selection:bg-[#c9a961] selection:text-black">

            {/* Navbar - Centered Layout */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full py-6 px-8 fixed top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between relative">

                    {/* Logo (Left) */}
                    <div className="flex items-center gap-3 w-[200px]">
                        <div className="w-10 h-10 bg-[#c9a961] rounded-md flex items-center justify-center text-black shadow-[0_0_15px_rgba(201,169,97,0.3)]">
                            <QrCode className="w-6 h-6" />
                        </div>
                        <span className="font-serif text-xl tracking-wide hidden sm:block">QR Card Studio</span>
                    </div>

                    {/* Nav Links (Absolute Center) */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <a href="#features" className="text-sm font-medium text-white/70 hover:text-[#c9a961] transition-colors tracking-wide">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-white/70 hover:text-[#c9a961] transition-colors tracking-wide">
                            How it Works
                        </a>
                        <a href="#about" className="text-sm font-medium text-white/70 hover:text-[#c9a961] transition-colors tracking-wide">
                            About
                        </a>
                    </nav>

                    {/* CTA Button (Right) */}
                    <div className="flex justify-end w-[200px]">
                        <Link to="/create">
                            <button className="bg-[#c9a961] text-[#0a0a0a] px-5 py-2.5 rounded-sm font-medium text-sm hover:bg-[#d4b46e] transition-all hover:shadow-[0_0_20px_rgba(201,169,97,0.4)] flex items-center gap-2">
                                Create Card <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col relative overflow-hidden pt-32">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c9a961] rounded-full opacity-[0.03] blur-[120px] pointer-events-none" />

                <section className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center pb-20">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a961]/30 bg-[#c9a961]/5 text-[#c9a961] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a961] animate-pulse" />
                            New: AI Message Generator
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.1]"
                    >
                        Create Premium <br />
                        <span className="font-serif italic text-[#c9a961]">
                            Review Cards
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Design premium feedback cards for your business.<br className="hidden md:block" />
                        Print-ready, professional, and crafted to inspire trust.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    >
                        <Link to="/create" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-4 bg-[#f5f5f0] text-[#0a0a0a] rounded-sm font-semibold text-base transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
                                <QrCode className="w-5 h-5" />
                                Start Creating Now
                            </button>
                        </Link>

                        <a href="#gallery" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-[#f5f5f0] border border-white/10 rounded-sm font-medium text-base hover:bg-white/10 transition-colors flex items-center justify-center">
                                View Examples
                            </button>
                        </a>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 border-t border-white/5 bg-[#0a0a0a]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="font-serif text-3xl md:text-4xl text-[#f5f5f0]">Why Premium Cards?</h2>
                            <p className="text-white/50 max-w-2xl mx-auto">Elevate your customer interactions with physical touchpoints that feel as good as they look.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { title: "Instant Reviews", desc: "Direct customers to your Google or TripAdvisor reviews with a single scan." },
                                { title: "Privacy First", desc: "No tracking, no cookies. Your data and your customers' data stays your own." },
                                { title: "Print Ready", desc: "Export high-resolution PDFs with crop marks, ready for any professional printer." }
                            ].map((feature, i) => (
                                <div key={i} className="p-8 border border-white/5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                    <div className="w-10 h-10 border border-[#c9a961]/30 rounded-full flex items-center justify-center text-[#c9a961] mb-6">
                                        {i + 1}
                                    </div>
                                    <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                                    <p className="text-white/50 leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section id="how-it-works" className="py-24 border-t border-white/5 relative overflow-hidden">
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#c9a961] rounded-full opacity-[0.02] blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                            <div className="space-y-8">
                                <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                                    Simple workflow. <br />
                                    <span className="text-[#c9a961] italic">Stunning results.</span>
                                </h2>
                                <p className="text-white/50 text-lg leading-relaxed">
                                    Go from idea to print-ready file in less than 2 minutes. No design skills required.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        "Select a premium template",
                                        "Customize colors and logo",
                                        "Download print-ready PDF"
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-[#f5f5f0] text-[#0a0a0a] flex items-center justify-center font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <span className="text-lg font-light">{step}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <Link to="/create">
                                        <button className="text-[#c9a961] border-b border-[#c9a961] pb-1 hover:text-[#d4b46e] hover:border-[#d4b46e] transition-colors text-sm uppercase tracking-widest">
                                            Try the generator
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="relative aspect-square border border-white/10 rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent p-8 flex items-center justify-center overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                                {/* Floating Card Mockup */}
                                {/* Floating Card Mockup - Ocean Spa */}
                                <div className="relative w-[280px] aspect-[1/1.6] bg-[#0f0f0f] rounded-xl border border-[#06b6d4]/40 shadow-2xl transform rotate-[-6deg] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-105 flex flex-col items-center text-center p-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/10 to-transparent pointer-events-none" />

                                    {/* Simple Spacer/Top area instead of Logo for cleaner look */}
                                    <div className="h-10"></div>

                                    <h3 className="font-serif text-3xl tracking-wide text-[#f5f5f5] mb-4">Ocean Spa</h3>
                                    <p className="text-sm text-white/70 mb-8 font-light leading-relaxed px-2">
                                        Refresh your senses. Let us know how we did.
                                    </p>

                                    {/* QR Code Area */}
                                    <div className="p-3 bg-[#0f0f0f] border border-[#06b6d4]/30 rounded-lg shadow-lg mb-8">
                                        <QrCode className="w-24 h-24 text-[#06b6d4]" />
                                    </div>

                                    <p className="text-xs font-bold text-[#f5f5f5] uppercase tracking-widest mt-auto mb-2">RATE US</p>
                                    <p className="text-[10px] text-white/30 font-light">Powered by Bilal</p>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute bottom-10 right-10 bg-[#06b6d4] text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-[#06b6d4]/20 transform translate-y-2 group-hover:translate-y-0 transition-transform flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3" /> Demo Template
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Templates Preview Strip (Fade in later) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1.5 }}
                    className="w-full overflow-hidden opacity-40 hover:opacity-100 transition-opacity duration-700 py-12"
                >
                    <div className="flex gap-4 animate-scroll whitespace-nowrap px-4 justify-center">
                        {/* Placeholder for small previews if needed, or keeping it clean for now */}
                    </div>
                </motion.div>
            </main>


            {/* Footer */}
            <footer className="py-20 border-t border-white/5 bg-[#0a0a0a] text-sm">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">

                        {/* About Section */}
                        <div id="about" className="md:col-span-2 space-y-6 scroll-mt-32">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#c9a961] rounded-md flex items-center justify-center text-black">
                                    <QrCode className="w-5 h-5" />
                                </div>
                                <span className="font-serif text-xl tracking-wide text-[#f5f5f0]">QR Card Studio</span>
                            </div>
                            <p className="text-white/50 leading-relaxed max-w-sm">
                                We craft premium, privacy-first digital tools for businesses that value aesthetics.
                                Our mission is to help you collect more reviews with physical interfaces that customers actually want to interact with.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-6">
                            <h4 className="font-medium text-[#c9a961] tracking-widest text-xs uppercase">Platform</h4>
                            <ul className="space-y-3 text-white/50">
                                <li>
                                    <Link to="/create" className="hover:text-[#c9a961] transition-colors">Create Card</Link>
                                </li>

                                <li>
                                    <a href="#" className="hover:text-[#c9a961] transition-colors">About Us</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#c9a961] transition-colors">Pricing</a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact/Legal */}
                        <div className="space-y-6">
                            <h4 className="font-medium text-[#c9a961] tracking-widest text-xs uppercase">Connect</h4>
                            <ul className="space-y-3 text-white/50">
                                <li>
                                    <a href="mailto:hello@qrcardstudio.com" className="hover:text-[#c9a961] transition-colors">Contact Support</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#c9a961] transition-colors">Terms of Service</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#c9a961] transition-colors">Privacy Policy</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
                        <p>&copy; 2025 QR Card Studio. All rights reserved.</p>
                        <p>Designed for excellence.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}


