// /home/scott/Desktop/Office/decentrahub/frontend/app/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ConnectKitButton } from 'connectkit'; // Remove useModal
// Assuming you have openConnectModal here

// Icons - Import specific icons as needed
import {
  FaShieldAlt,
  FaUsers,
  FaPenFancy, // Mint
  FaMoneyBillWave, // Earn
  FaPalette, // Generic feature
  FaConnectdevelop, // Generic feature
  FaChartLine, // Analytics
} from 'react-icons/fa';
import {
  SiLens,
  SiPolygon,
  SiAlchemy,
  SiReact, // Example for Bonsai or ConnectKit
  // Add more tech stack icons
} from 'react-icons/si';
import { BsTwitterX, BsLinkedin, BsDiscord, BsGithub } from 'react-icons/bs';
import { FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';

// Import Swiper styles (you might need to do this in a global CSS file or layout if issues persist)
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// For Swiper, you'd import SwiperCore, Swiper, SwiperSlide from 'swiper/react' in respective components

// Placeholder for Lottie Animation (replace with actual Lottie player and animation data)
const LottiePlaceholder = ({ className }: { className?: string }) => (
  <div className={`bg-gray-700/50 rounded-lg flex items-center justify-center text-white ${className}`}>
    Lottie/SVG Animation
  </div>
);

// --- Hero Section ---
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Optional: Parallax background image here */}
      <div className="absolute inset-0 bg-black opacity-30"></div> {/* Overlay */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
        >
          Empowering Creators.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Decentralizing Content.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-slate-300"
        >
          Mint, Share, and Monetize your digital creations seamlessly on DecentraHub.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link
            href="/marketplace"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 text-lg"
          >
            Explore Marketplace
          </Link>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <button
                onClick={show}
                className="px-8 py-3 bg-transparent border-2 border-purple-400 hover:bg-purple-500/20 text-purple-300 hover:text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 text-lg"
              >
                Connect Wallet
              </button>
            )}
          </ConnectKitButton.Custom>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16"
        >
          <LottiePlaceholder className="w-full max-w-md h-64 mx-auto" />
        </motion.div>
      </div>
       {/* Subtle moving background elements */}
       <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
       <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse-slower"></div>
    </section>
  );
};

// --- Features Section ---
const features = [
  { title: "Decentralized Ownership", description: "True NFT-based ownership of digital assets.", icon: <FaShieldAlt className="w-10 h-10 text-purple-400" /> },
  { title: "Seamless Onboarding", description: "Connect in seconds with ConnectKit.", icon: <FaConnectdevelop className="w-10 h-10 text-purple-400" /> },
  { title: "Social Integration", description: "Build your community with Lens Protocol.", icon: <SiLens className="w-10 h-10 text-purple-400" /> },
  { title: "Smart Media Integration", description: "Interactive experiences with Bonsai Smart Media.", icon: <FaPalette className="w-10 h-10 text-purple-400" /> }, // Replace with Bonsai icon if available
  { title: "Analytics & Insights", description: "Transparent data through Alchemy.", icon: <FaChartLine className="w-10 h-10 text-purple-400" /> },
  { title: "Secure & Transparent", description: "Built on blockchain for verifiable transactions.", icon: <FaUsers className="w-10 h-10 text-purple-400" /> }, // Placeholder, better icon needed
];

const FeaturesSection = () => (
  <section className="py-16 md:py-24 bg-slate-800 text-slate-100">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y:20 }} animate={{ opacity:1, y:0 }} transition={{delay:0.2, duration: 0.5}}
        className="text-3xl md:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
      >
        Why DecentraHub?
      </motion.h2>
      <motion.p
         initial={{ opacity: 0, y:20 }} animate={{ opacity:1, y:0 }} transition={{delay:0.3, duration: 0.5}}
        className="text-center text-lg text-slate-400 mb-12 md:mb-16 max-w-2xl mx-auto"
      >
        Discover a new era of content creation and ownership, designed for transparency and empowerment.
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-slate-700/50 p-6 rounded-xl shadow-xl hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col items-center text-center"
          >
            <div className="mb-4 p-3 bg-slate-600 rounded-full">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- How It Works Section ---
const steps = [
  { title: "Create & Mint Content", description: "Effortlessly mint your articles, videos, and music as Smart Media NFTs.", icon: <FaPenFancy className="w-12 h-12 text-pink-400" /> },
  { title: "Engage Your Community", description: "Share and monetize through Lens-powered social interactions and profiles.", icon: <FaUsers className="w-12 h-12 text-pink-400" /> },
  { title: "Earn Royalties Instantly", description: "Receive payments directly to your wallet, no middlemen, full transparency.", icon: <FaMoneyBillWave className="w-12 h-12 text-pink-400" /> },
];

const HowItWorksSection = () => (
  <section className="py-16 md:py-24 bg-slate-900 text-slate-100">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{once: true}} transition={{delay:0.2, duration: 0.5}}
        className="text-3xl md:text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
      >
        Simple Steps to Get Started
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-10 md:gap-12 relative">
        {/* Optional: Connecting line graphic behind steps */}
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.2, duration: 0.7 }}
            className="flex flex-col items-center text-center p-6 bg-slate-800/60 rounded-lg shadow-lg"
          >
            <div className="p-4 bg-slate-700 rounded-full mb-6">{step.icon}</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">{step.title}</h3>
            <p className="text-slate-300 leading-relaxed">{step.description}</p>
            <div className="mt-4 text-pink-400 font-bold text-5xl opacity-30">0{index + 1}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- Marketplace Showcase Section ---
// TODO: Implement with Swiper.js or a grid layout
// This is a placeholder structure
const marketplaceItems = [
  { id: 1, title: "Futuristic Cityscape", creator: "AI Artist", category: "Art", image: "https://via.placeholder.com/300x200/FF00FF/FFFFFF?Text=NFT+Art1", price: "0.5 ETH" },
  { id: 2, title: "Ambient Dreams", creator: "Sound Waves", category: "Music", image: "https://via.placeholder.com/300x200/00FFFF/000000?Text=NFT+Music1", price: "0.1 ETH" },
  { id: 3, title: "Decentralized Thoughts", creator: "Philosopher X", category: "Article", image: "https://via.placeholder.com/300x200/FFFF00/000000?Text=NFT+Article1", price: "0.02 ETH" },
  { id: 4, title: "Code Breaker", creator: "Dev Guru", category: "Video", image: "https://via.placeholder.com/300x200/0000FF/FFFFFF?Text=NFT+Video1", price: "0.2 ETH" },
];

const MarketplaceShowcaseSection = () => (
  <section className="py-16 md:py-24 bg-slate-800 text-slate-100">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{once: true}} transition={{delay:0.2, duration: 0.5}}
        className="text-3xl md:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
      >
        Explore the Marketplace
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{once: true}} transition={{delay:0.3, duration: 0.5}}
        className="text-center text-lg text-slate-400 mb-12 md:mb-16 max-w-2xl mx-auto"
      >
        Discover unique digital creations from talented artists, musicians, and writers.
      </motion.p>
      {/* Placeholder for Filters */}
      <div className="flex justify-center space-x-4 mb-8">
        {['All', 'Articles', 'Music', 'Videos', 'Art'].map(filter => (
          <button key={filter} className="px-4 py-2 text-sm rounded-md bg-slate-700 hover:bg-purple-600 transition-colors text-slate-300 hover:text-white">
            {filter}
          </button>
        ))}
      </div>

      {/* TODO: Implement Swiper Carousel or enhance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {marketplaceItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-slate-700/50 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-all duration-300 group"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={300}  // Add width
              height={200} // Add height
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 text-white">{item.title}</h3>
              <p className="text-xs text-purple-400 mb-2">By {item.creator} - {item.category}</p>
              <div className="flex justify-between items-center">
                <p className="text-md font-bold text-slate-200">{item.price}</p>
                <Link href={`/marketplace/${item.id}`} className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md">
                  View
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link
          href="/marketplace"
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 inline-flex items-center"
        >
          View More <FiChevronRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  </section>
);

// --- Creator Testimonials Section ---
// TODO: Implement with Swiper.js
const testimonials = [
  { name: "CreativeSoul", quote: "DecentraHub gave me true ownership of my art. The future is here!", image: "https://via.placeholder.com/100/9CA3AF/FFFFFF?Text=User1", role: "Digital Artist" },
  { name: "SynthwaveMaster", quote: "Finally, a platform that understands musicians. Direct earnings, no cuts!", image: "https://via.placeholder.com/100/F3A5B5/000000?Text=User2", role: "Music Producer" },
  { name: "StoryTellerX", quote: "Lens integration is a game-changer for community building around my writing.", image: "https://via.placeholder.com/100/A0E5F5/000000?Text=User3", role: "Writer" },
];

const CreatorTestimonialsSection = () => (
  <section className="py-16 md:py-24 bg-slate-900 text-slate-100">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{once: true}} transition={{delay:0.2, duration: 0.5}}
        className="text-3xl md:text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
      >
        Loved by Creators
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="bg-slate-800/70 p-6 rounded-xl shadow-lg text-center"
          >
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="rounded-full object-cover border-2 border-purple-400"
              />
            </div>
            <p className="text-slate-300 italic mb-4 leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <h4 className="font-semibold text-lg text-white">{testimonial.name}</h4>
            <p className="text-sm text-purple-300">{testimonial.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- Technology Stack & Partners Section ---
const techStack = [
  { name: "Lens Protocol", icon: <SiLens className="w-12 h-12" />, description: "Decentralized social graph." },
  { name: "Bonsai Smart Media", icon: <SiReact className="w-12 h-12" />, description: "Interactive NFT experiences." }, // Replace with Bonsai Icon
  { name: "Alchemy", icon: <SiAlchemy className="w-12 h-12" />, description: "Blockchain developer platform." },
  { name: "ConnectKit", icon: <FaConnectdevelop className="w-12 h-12" />, description: "Seamless wallet onboarding." }, // Replace with ConnectKit Icon
  { name: "Polygon", icon: <SiPolygon className="w-12 h-12" />, description: "Scalable blockchain infrastructure." },
  // Add more
];

const TechnologyStackSection = () => (
  <section className="py-16 md:py-24 bg-slate-800 text-slate-100">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{once: true}} transition={{delay:0.2, duration: 0.5}}
        className="text-3xl md:text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
      >
        Powered by Leading Technologies
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center group"
          >
            <div className="p-4 text-slate-300 group-hover:text-purple-400 transition-colors duration-300">{tech.icon}</div>
            <p className="mt-2 text-sm text-slate-300 group-hover:text-white transition-colors duration-300">{tech.name}</p>
            {/* <p className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{tech.description}</p> */}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- Call to Action Section ---
const CallToActionSection = () => {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-10"></div> {/* Example pattern */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{once: true}} transition={{delay:0.2, duration: 0.5}}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6"
        >
          Join DecentraHub Today.
          <br />
          Redefine Your Ownership.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{once: true}} transition={{delay:0.3, duration: 0.5}}
          className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-purple-100"
        >
          Ready to take control of your digital content? Connect your wallet and start minting, sharing, and earning.
        </motion.p>
        <motion.button
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,255,255,0.5)" }}
          transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
          className="px-10 py-4 bg-white text-purple-600 font-bold rounded-lg shadow-2xl text-lg"
        >
          Get Started Now
        </motion.button>
      </div>
      {/* Pulsating light effect placeholder */}
      <motion.div
        className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-white/20 rounded-full filter blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
    </section>
  );
};

// --- Footer Section ---
const LandingPageFooter = () => (
  <footer className="bg-slate-900 text-slate-400 py-16">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div>
          <h5 className="text-xl font-bold text-white mb-4">DecentraHub</h5>
          <p className="text-sm">Empowering creators through decentralized content ownership and monetization.</p>
        </div>
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
            <li><Link href="/marketplace" className="hover:text-purple-400 transition-colors">Marketplace</Link></li>
            <li><Link href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</Link></li> {/* Assuming an ID on the section */}
            <li><Link href="#features" className="hover:text-purple-400 transition-colors">Features</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Legal</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Stay Connected</h5>
          <form onSubmit={(e) => e.preventDefault()} className="flex mb-4">
            <input type="email" placeholder="Enter your email" className="bg-slate-800 text-sm text-slate-200 px-3 py-2 rounded-l-md focus:ring-purple-500 focus:border-purple-500 flex-grow" />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md text-sm">Subscribe</button>
          </form>
          <div className="flex space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"><BsTwitterX size={20} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"><BsLinkedin size={20} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"><BsDiscord size={20} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"><BsGithub size={20} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} DecentraHub. All rights reserved. Built for the Lens Spring Hackathon.</p>
      </div>
    </div>
  </footer>
);

// --- Main Landing Page Component ---
export default function LandingPage() {
  return (
    <div className="bg-slate-900"> {/* Ensure main background for any gaps */}
      {/* Navbar is usually in layout.tsx and would appear above this */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <MarketplaceShowcaseSection />
        <CreatorTestimonialsSection />
        <TechnologyStackSection />
        <CallToActionSection />
      </main>
      <LandingPageFooter />
    </div>
  );
}
