import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowDown, Bot, Briefcase, GalleryHorizontal, MapPin, Mail, Send } from 'lucide-react';

import { shouldReduceEffects } from '@/lib/perf';
import { publicPath } from '@/lib/public-path';

const ASK_SAAD_URL = 'https://ask-saad-barghouth.lovable.app/';

export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!section || !image || !overlay || !content) return;

    if (shouldReduceEffects()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        image,
        { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.25, ease: 'power2.out' }
      )
        .fromTo(
          overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.9, ease: 'power2.out' },
          '-=0.9'
        )
        .fromTo(
          content.querySelectorAll('.hero-panel'),
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.55'
        )
        .fromTo(
          content.querySelectorAll('.hero-item'),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
          '-=0.45'
        );

      // Keep it subtle: a slow, barely-noticeable drift once the entrance finishes.
      gsap.to(image, {
        scale: 1.03,
        duration: 16,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      });
    }, section);

    return () => ctx.revert();

  }, []);

  const scrollToExplore = () => {
    const target = document.getElementById("home-overview");
    if (target) {
      target.scrollIntoView({ behavior: shouldReduceEffects() ? "auto" : "smooth", block: "start" });
      return;
    }

    navigate("/about");
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-4.5rem)] overflow-hidden bg-navy"
    >
      {/* Full-screen Background Image - YOUR PHOTO */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-[1] will-change-transform"
      >
        <img
          src={publicPath('hero-main.jpg')}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center will-change-transform"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Dark Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[2] bg-gradient-to-t from-navy via-navy/75 sm:via-navy/60 to-navy/35 sm:to-navy/25"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 vignette z-[3]" />
      <div className="absolute inset-0 noise-overlay z-[4]" />
      <div className="absolute inset-0 grid-overlay z-[5] opacity-20" />

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-[6] flex flex-col justify-end pb-4 sm:pb-8 site-gutter"
      >
        <div className="w-full max-w-6xl">
          <div className="hero-panel text-shadow p-0 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
              <div className="lg:col-span-7">
                <h1 className="hero-item font-display font-bold text-[clamp(36px,9vw,88px)] sm:text-[clamp(44px,7vw,88px)] text-slate-50 leading-[0.98] text-balance">
                  Saad Elsayed Barghouth
                </h1>


                <div className="hero-item mt-8 flex flex-col sm:flex-row sm:items-center flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/projects')}
                    className="button-cta inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-coral text-navy font-semibold rounded-xl shadow-xl shadow-coral/15"
                  >
                    <Briefcase className="w-4 h-4" />
                    View Projects
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="button-cta inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-slate-900/55 border border-slate-700/60 text-slate-100 hover:text-teal rounded-xl"
                  >
                    <Mail className="w-4 h-4 text-teal" />
                    Book a consultation
                  </button>
                  <a
                    href={ASK_SAAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-cta inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-teal/15 border border-teal/35 text-teal rounded-xl"
                  >
                    <Bot className="w-4 h-4" />
                    Ask Saad AI
                  </a>
                </div>

                <div className="hero-item mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/35 px-4 py-2">
                    <MapPin className="w-4 h-4 text-teal" />
                    Giza, Egypt
                  </span>
                  <a
                    href="mailto:saad@barghouth.me"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/35 px-4 py-2 text-slate-200 hover:text-teal transition-colors"
                  >
                    <Mail className="w-4 h-4 text-teal" />
                    saad@barghouth.me
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 hidden lg:block">
                <div className="hero-item flex flex-wrap gap-3 mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={() => navigate('/projects')}
                    className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-coral hover:bg-coral-dark text-navy font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    <Briefcase className="w-4 h-4" />
                    View Projects
                  </button>
                  <a
                    href={ASK_SAAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-teal/15 border border-teal/35 text-teal hover:bg-teal/20 hover:border-teal/55 rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target animate-glow-pulse"
                  >
                    <Bot className="w-4 h-4" />
                    Ask Saad AI
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate('/gallery')}
                    className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    <GalleryHorizontal className="w-4 h-4" />
                    Browse Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-coral/10 border border-coral/35 text-coral hover:bg-coral/15 hover:border-coral/55 rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    <Send className="w-4 h-4" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={scrollToExplore}
            aria-label="Scroll to explore content"
            className="hero-item mt-3 sm:mt-2 inline-flex items-center gap-2 text-slate-300 hover:text-teal transition-all duration-300 group"
          >
            <span className="font-mono text-sm tracking-wide">Scroll to explore</span>
            <ArrowDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
