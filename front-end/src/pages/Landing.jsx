import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Sprout, 
  ShoppingBag, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  Shield, 
  Globe, 
  Bell, 
  LogOut, 
  ArrowRight, 
  Star, 
  Users,
  Timer,
  CheckCircle,
  Coins,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");
  
  // State for the image carousel at the bottom
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselSlides = [
    {
      title: "Bridging Farmers and Markets",
      subtitle: "Empowering Farmers. Enriching Futures.",
      tagline: "A smarter way to connect, trade and grow together.",
      image: "/carousel_banner.png"
    },
    {
      title: "Direct Trading Platform",
      subtitle: "Eliminating Middlemen Commissions",
      tagline: "Farmers get the true price for their hard work directly from buyers.",
      image: "/farmer_banner.png"
    }
  ];

  // Auto-advance slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6005);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  return (
    <div className="min-h-screen bg-[#fcfaf4] font-sans antialiased text-[#211c14]">
      {/* ── HEADER NAVIGATION ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-paddy-100 bg-[#fcfaf4]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-paddy-800 p-2 text-white">
              <Sprout size={24} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-paddy-900 leading-tight">
                Raithu Sethu
              </h1>
              <p className="font-display text-[11px] font-medium text-paddy-700 leading-none">
                రైతు సేతు
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-paddy-900 border-b-2 border-paddy-600 pb-1">
              Home
            </Link>
            <Link to="/buyer/marketplace" className="text-sm font-semibold text-neutral-600 hover:text-paddy-900 transition-colors">
              Marketplace
            </Link>
            <Link to="/farmer/dashboard" className="text-sm font-semibold text-neutral-600 hover:text-paddy-900 transition-colors">
              Farmer
            </Link>
            <Link to="/farmer/crops" className="text-sm font-semibold text-neutral-600 hover:text-paddy-900 transition-colors">
              Upload Crop
            </Link>
          </div>

          {/* Right Nav Icons (Authenticated vs Guest) */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === "English" ? "తెలుగు" : "English")}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 shadow-sm hover:bg-neutral-50"
            >
              <Globe size={14} className="text-neutral-500" />
              <span>{language}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Chat Icon */}
                <Link
                  to="/chat"
                  className="rounded-full bg-white p-2 text-neutral-600 border border-neutral-200 shadow-sm hover:text-paddy-700 transition-colors relative"
                >
                  <MessageSquare size={18} />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-paddy-600"></span>
                </Link>

                {/* Notification Icon */}
                <Link
                  to="/notifications"
                  className="rounded-full bg-white p-2 text-neutral-600 border border-neutral-200 shadow-sm hover:text-paddy-700 transition-colors relative"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500"></span>
                </Link>

                {/* User Avatar */}
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paddy-800 text-sm font-bold text-white shadow-md">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-neutral-700">
                    {user?.name || "User"}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="rounded-full bg-white p-2 text-neutral-500 border border-neutral-200 shadow-sm hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-neutral-700 hover:text-paddy-800 px-3 py-1.5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-paddy-800 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-paddy-700 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

        </div>
      </nav>

      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Heading and description */}
          <div className="space-y-8 lg:col-span-7">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-paddy-50 border border-paddy-100 px-4 py-1.5">
              <Star size={14} className="text-paddy-700 fill-paddy-600" />
              <span className="text-xs font-bold tracking-wide uppercase text-paddy-800">
                Direct Farm-to-Buyer Marketplace
              </span>
            </div>

            {/* Welcome Heading */}
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-paddy-900 sm:text-5xl md:text-6xl leading-tight">
                Welcome to <br />
                <span className="text-paddy-700">Raithu Sethu</span>
              </h1>
              <p className="max-w-xl text-lg text-neutral-600 leading-relaxed">
                Eliminate middlemen commission, reduce food wastage, and maximize profits. 
                Connecting Telangana & Andhra farmers directly with food chains, wholesalers, and retail buyers.
              </p>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/buyer/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-paddy-800 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-paddy-800/10 hover:bg-paddy-700 transition-all hover:translate-x-0.5 active:translate-x-0 active:scale-[0.98]"
              >
                Explore Marketplace <ArrowRight size={16} />
              </Link>
              <Link
                to={isAuthenticated ? "/farmer/crops" : "/login?role=farmer"}
                className="inline-flex items-center justify-center rounded-xl border-2 border-neutral-300 bg-white px-6 py-4 text-sm font-bold text-neutral-700 hover:border-paddy-800 hover:text-paddy-800 transition-colors"
              >
                Upload Crop
              </Link>
            </div>

          </div>

          {/* Right Column: Agri Mandi Volume Listing */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white p-6 shadow-xl border border-neutral-200/50">
              
              {/* Card top flags */}
              <div className="absolute top-[-14px] right-6 rounded-full bg-orange-500 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md flex items-center gap-1">
                <Zap size={11} className="fill-white" /> Live Prices
              </div>

              {/* Title Header */}
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-paddy-800 mb-6">
                <div className="h-2 w-2 rounded-full bg-paddy-600 animate-ping"></div>
                Active Agri Mandi Volume
              </div>

              {/* Listings Stack */}
              <div className="space-y-4">
                
                {/* Crop Item 1 */}
                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 p-4 transition-all hover:bg-neutral-50 hover:border-paddy-100">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-xl bg-paddy-50 p-2.5 text-paddy-800">
                      <Sprout size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800">Sona Masuri Paddy</h4>
                      <p className="text-[11px] text-neutral-400">Siddipet Rural • 120 Qtl</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-neutral-800">₹2,150 / Qtl</div>
                    <span className="inline-block text-[9px] font-extrabold tracking-wider uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mt-1">
                      Flash Sale
                    </span>
                  </div>
                </div>

                {/* Crop Item 2 */}
                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 p-4 transition-all hover:bg-neutral-50 hover:border-paddy-100">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800">Guntur Red Chilli</h4>
                      <p className="text-[11px] text-neutral-400">Guntur Market • 45 Bags</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-neutral-800">₹18,500 / Bag</div>
                    <span className="inline-block text-[9px] font-extrabold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                      High Demand
                    </span>
                  </div>
                </div>

                {/* Crop Item 3 */}
                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 p-4 transition-all hover:bg-neutral-50 hover:border-paddy-100">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-xl bg-gold-50 p-2.5 text-gold-600">
                      <Coins size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800">Kasturi Turmeric</h4>
                      <p className="text-[11px] text-neutral-400">Nizamabad • 15 Qtl</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-neutral-800">₹7,800 / Qtl</div>
                    <span className="inline-block text-[9px] font-extrabold tracking-wider uppercase text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full mt-1">
                      Reserved
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── STATISTICS BAR ──────────────────────────────────────────── */}
      <section className="border-y border-paddy-100/50 bg-paddy-50/40 py-10 shadow-inner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:grid-cols-4 text-center">
            
            <div>
              <div className="flex justify-center text-paddy-850 mb-1">
                <Coins className="text-paddy-700 h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="text-2xl font-black text-paddy-900 tracking-tight sm:text-3xl">₹1.4 Cr+</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Farmer Revenue Facilitated</div>
            </div>

            <div>
              <div className="flex justify-center text-paddy-850 mb-1">
                <Timer className="text-paddy-700 h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="text-2xl font-black text-paddy-900 tracking-tight sm:text-3xl">12 Hours</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Avg. Crop Booking Time</div>
            </div>

            <div>
              <div className="flex justify-center text-paddy-850 mb-1">
                <CheckCircle className="text-paddy-700 h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="text-2xl font-black text-paddy-900 tracking-tight sm:text-3xl">98%</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Successful Weighments</div>
            </div>

            <div>
              <div className="flex justify-center text-paddy-850 mb-1">
                <Shield className="text-paddy-700 h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="text-2xl font-black text-paddy-900 tracking-tight sm:text-3xl">0%</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Middlemen Commissions</div>
            </div>

          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FEATURE CAROUSEL (Image 3) ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Mandi spotlight / title header */}
        <div className="flex items-end justify-between border-b border-neutral-200 pb-5 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-paddy-700 mb-1">
              <ShoppingBag size={14} /> Mandi Spotlight
            </div>
            <h2 className="font-display text-3xl font-extrabold text-neutral-900">
              Featured Crops on Sale
            </h2>
          </div>
          <Link
            to="/buyer/marketplace"
            className="group inline-flex items-center gap-1 text-sm font-bold text-paddy-800 hover:text-paddy-700"
          >
            View All Listings <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel Graphic Window */}
        <div className="relative h-[450px] sm:h-[500px] w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl">
          
          {/* Background Images */}
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-75" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          {/* Golden/Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Languages Dropdown Overlay */}
          <div className="absolute top-6 right-6 z-20">
            <div className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white flex items-center gap-1.5">
              <span>తెలుగు</span>
              <Globe size={13} />
            </div>
          </div>

          {/* Carousel Slide Texts (Logo, headings) */}
          <div className="absolute inset-x-0 top-12 flex flex-col items-center text-center px-4">
            <div className="flex items-center gap-2 mb-3 bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
              <Sprout size={18} className="text-paddy-300" />
              <span className="font-display text-base font-bold text-white tracking-wide">Raithu Sethu</span>
              <span className="font-display text-xs font-semibold text-paddy-200">రైతు సేతు</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-300">{carouselSlides[currentSlide].subtitle}</p>
            <h3 className="mt-2 text-2xl sm:text-4xl font-black text-white max-w-xl font-display">
              {carouselSlides[currentSlide].title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-200 max-w-md">
              {carouselSlides[currentSlide].tagline}
            </p>
          </div>

          {/* Floating White Features Card at bottom */}
          <div className="absolute inset-x-6 bottom-12 flex justify-center z-10">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-neutral-100 text-center">
              
              <div className="flex flex-col items-center p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="rounded-full bg-paddy-50 p-2 text-paddy-700 mb-2">
                  <Sprout size={16} />
                </div>
                <span className="text-[11px] font-black text-neutral-800 leading-tight">Reduce Food Waste</span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="rounded-full bg-gold-50 p-2 text-gold-700 mb-2">
                  <Coins size={16} />
                </div>
                <span className="text-[11px] font-black text-neutral-800 leading-tight">Increase Farmer Income</span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="rounded-full bg-paddy-50 p-2 text-paddy-700 mb-2">
                  <Users size={16} />
                </div>
                <span className="text-[11px] font-black text-neutral-800 leading-tight">Connect Directly</span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="rounded-full bg-emerald-50 p-2 text-emerald-700 mb-2">
                  <Shield size={16} />
                </div>
                <span className="text-[11px] font-black text-neutral-800 leading-tight">Secure Future</span>
              </div>

            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-white w-6" : "bg-white/40 w-2"
                }`}
              />
            ))}
          </div>

          {/* Arrow navigation triggers */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all"
          >
            <ChevronRight size={20} />
          </button>

        </div>

      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-paddy-100 bg-[#fcfaf4] py-12 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Sprout size={18} className="text-paddy-700" />
            <span className="font-display font-bold text-paddy-900">Raithu Sethu</span>
          </div>
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Raithu Sethu — Bridging Farmers & Buyers. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

