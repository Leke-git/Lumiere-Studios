/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Mail, 
  MapPin, 
  Phone, 
  Star, 
  Menu, 
  X, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const N8N_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK || '';

const SESSION_TYPES = ['Wedding', 'Portrait', 'Corporate', 'Events', 'Other'];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSessionType, setActiveSessionType] = useState('Wedding');
  const [budget, setBudget] = useState(500000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Cursor Refs
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      sessionType: activeSessionType,
      budget: Number(budget),
      preferredDate: formData.get('preferredDate'),
      urgency: formData.get('urgency'),
      message: formData.get('message'),
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to submit enquiry');
      }
    } catch (err) {
      setError('Something went wrong. Please try again or contact us directly.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-gold selection:text-white">
      {/* Custom Cursor */}
      <div ref={dotRef} className="cursor-dot hidden lg:block" />
      <div ref={ringRef} className="cursor-ring hidden lg:block" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="text-gold w-6 h-6" />
            <span className="font-serif text-2xl tracking-tighter font-semibold">Lumière</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['About', 'Services', 'Gallery', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm uppercase tracking-widest font-medium hover:text-gold transition-colors"
              >
                {item}
              </a>
            ))}
            <a 
              href="#contact" 
              className="bg-ink text-cream px-6 py-2.5 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-gold transition-all duration-300"
            >
              Book a Session
            </a>
          </div>

          <button className="md:hidden text-ink" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-cream pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {['About', 'Services', 'Gallery', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-2xl font-serif"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a 
                href="#contact" 
                className="bg-ink text-cream py-4 rounded-full text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Book a Session
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/lumiere-hero/1920/1080?grayscale" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/20 via-transparent to-cream" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="uppercase tracking-[0.4em] text-sm font-medium text-gold mb-6 block"
          >
            Lagos · Nigeria
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-serif mb-8 leading-tight"
          >
            Capturing the <br /> <span className="italic">Soul of Light</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a href="#contact" className="bg-ink text-cream px-10 py-4 rounded-full uppercase tracking-widest text-sm font-semibold hover:bg-gold transition-all duration-500 flex items-center gap-2 group">
              Start Your Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#gallery" className="border border-ink/20 px-10 py-4 rounded-full uppercase tracking-widest text-sm font-semibold hover:bg-ink hover:text-cream transition-all duration-500">
              View Portfolio
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gold/40" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="reveal">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/photographer/800/1000" 
                alt="The Photographer" 
                className="rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 bg-gold p-10 rounded-2xl hidden lg:block">
                <p className="text-cream font-serif text-2xl italic">"Light is the brush, <br /> emotion is the canvas."</p>
              </div>
            </div>
          </div>
          <div className="reveal">
            <span className="text-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Our Story</span>
            <h2 className="text-5xl font-serif mb-8 leading-tight">Crafting Timeless <br /> Visual Legacies</h2>
            <p className="text-muted text-lg leading-relaxed mb-10">
              Lumière was born from a passion for the unscripted moments. Based in the heart of Lagos, we specialize in high-end photography that blends editorial sophistication with raw, human emotion. Whether it's the grandeur of a wedding or the quiet intimacy of a portrait, we believe every frame should tell a story that lasts generations.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: 'Years Experience', value: '12+' },
                { label: 'Happy Clients', value: '500+' },
                { label: 'Awards Won', value: '15' },
                { label: 'Sessions Shot', value: '1.2k' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-serif text-gold mb-1">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-muted font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 reveal">
            <span className="text-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Exquisite Services</span>
            <h2 className="text-5xl font-serif">Tailored Experiences</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Weddings', price: '450,000', img: 'wedding' },
              { title: 'Portraits', price: '85,000', img: 'portrait' },
              { title: 'Corporate', price: '200,000', img: 'business' },
            ].map((service) => (
              <div key={service.title} className="reveal group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="h-80 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/lumiere-${service.img}/600/800`} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif mb-2">{service.title}</h3>
                  <p className="text-muted text-sm mb-6">Capturing your most precious moments with elegance and precision.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-medium">From ₦{service.price}</span>
                    <a href="#contact" className="text-ink hover:text-gold transition-colors"><ChevronRight /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 overflow-hidden bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-6 mb-16 flex items-end justify-between reveal">
          <div>
            <span className="text-gold uppercase tracking-widest text-sm font-semibold mb-4 block">The Portfolio</span>
            <h2 className="text-5xl font-serif">Visual Poetry</h2>
          </div>
          <a href="#" className="hidden md:block text-sm uppercase tracking-widest border-b border-gold pb-1 hover:text-gold transition-colors">View All Works</a>
        </div>

        <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar pb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-none w-[300px] md:w-[450px] h-[600px] reveal group relative overflow-hidden rounded-xl">
              <img 
                src={`https://picsum.photos/seed/gallery-${i}/900/1200`} 
                alt={`Gallery ${i}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div>
                  <p className="text-gold text-xs uppercase tracking-widest mb-2">Series 0{i}</p>
                  <h4 className="text-xl font-serif">Ethereal Moments</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center reveal">
          <div className="flex justify-center gap-1 mb-8">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 fill-gold text-gold" />)}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic mb-10 leading-relaxed">
            "Lumière didn't just take photos; they captured the feeling of our wedding day. Every time we look at the album, we are transported back to those exact emotions. Simply magical."
          </h2>
          <p className="font-medium uppercase tracking-widest text-sm">— Sarah & David, Wedding Session</p>
        </div>
      </section>

      {/* Contact / Booking Form */}
      <section id="contact" className="py-32 px-6 bg-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="reveal">
            <span className="text-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Inquiries</span>
            <h2 className="text-5xl font-serif mb-8">Let's Create <br /> Something Beautiful</h2>
            <p className="text-muted text-lg mb-12">
              Ready to book your session or have a question? Fill out the form and our team will get back to you with a personalized proposal.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gold shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-semibold">Email Us</p>
                  <p className="font-medium">hello@lumierestudio.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gold shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-semibold">Call Us</p>
                  <p className="font-medium">+234 800 LUMIERE</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gold shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-semibold">Visit Us</p>
                  <p className="font-medium">Victoria Island, Lagos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal bg-white p-8 md:p-12 rounded-3xl shadow-xl">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-serif mb-4">Enquiry Received</h3>
                <p className="text-muted mb-8">Thank you for reaching out. Our team is reviewing your request and will send a personalized response shortly.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-gold font-semibold uppercase tracking-widest text-sm border-b border-gold pb-1"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-muted">Full Name</label>
                    <input 
                      required 
                      name="name"
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-cream/30 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-muted">Email Address</label>
                    <input 
                      required 
                      name="email"
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-cream/30 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted">Session Type</label>
                  <div className="flex flex-wrap gap-2">
                    {SESSION_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setActiveSessionType(type)}
                        className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all ${
                          activeSessionType === type 
                            ? 'bg-gold text-white' 
                            : 'bg-cream/50 text-muted hover:bg-gold/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-muted">Preferred Date</label>
                    <input 
                      name="preferredDate"
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-cream/30 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-muted">Urgency</label>
                    <select 
                      name="urgency"
                      className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-cream/30 focus:outline-none focus:border-gold transition-colors appearance-none"
                    >
                      <option value="within_2_weeks">Within 2 Weeks</option>
                      <option value="within_month">Within a Month</option>
                      <option value="within_3_months">Within 3 Months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-widest font-semibold text-muted">Estimated Budget (₦)</label>
                    <span className="text-gold font-medium">₦{budget.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50000" 
                    max="2000000" 
                    step="50000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted">Your Message</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    placeholder="Tell us about your vision..."
                    className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-cream/30 focus:outline-none focus:border-gold transition-colors resize-none"
                  ></textarea>
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-ink text-cream py-4 rounded-xl uppercase tracking-widest text-sm font-bold hover:bg-gold transition-all duration-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-cream py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Camera className="text-gold w-6 h-6" />
              <span className="font-serif text-3xl tracking-tighter font-semibold">Lumière</span>
            </div>
            <p className="text-muted max-w-sm mb-8">
              Premium photography studio based in Lagos, Nigeria. Dedicated to capturing the elegance of life's most precious moments.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-xl mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><a href="#about" className="hover:text-gold transition-colors">About Studio</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Our Services</a></li>
              <li><a href="#gallery" className="hover:text-gold transition-colors">Portfolio</a></li>
              <li><a href="#contact" className="hover:text-gold transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li>Victoria Island, Lagos</li>
              <li>+234 800 LUMIERE</li>
              <li>hello@lumierestudio.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gold/10 mt-20 pt-8 flex flex-col md:row items-center justify-between gap-4 text-xs uppercase tracking-widest text-muted">
          <p>© {new Date().getFullYear()} Lumière Studio. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
