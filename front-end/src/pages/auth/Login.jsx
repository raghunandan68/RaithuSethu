import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/format";
import Button from "../../components/common/Button";
import { 
  Sprout, 
  Store, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Globe, 
  ShieldCheck, 
  Award, 
  Handshake, 
  Headset, 
  Users, 
  TrendingUp, 
  ArrowRight,
  CircleUser
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || "farmer";
  
  const [role, setRole] = useState(roleParam);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userData = await login(role, form);
      toast.success(`Welcome back, ${userData.name}!`);
      if (role === "farmer") navigate("/farmer/dashboard");
      else navigate("/buyer/marketplace");
    } catch (err) {
      setError(extractErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans">
      {/* ── LEFT COLUMN: Farmer Graphic Banner & Stats ──────────────── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-paddy-900 lg:block">
        {/* Background Graphic */}
        <img
          src="/farmer_banner.png"
          alt="Indian Agriculture"
          className="absolute inset-0 h-full w-full object-cover opacity-75 mix-blend-multiply transition-transform duration-10000 hover:scale-105"
        />
        
        {/* Logo and Overlay Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md">
                <Sprout size={28} className="text-paddy-300" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                  Raithu Sethu
                </h1>
                <p className="font-display text-sm font-medium text-paddy-200">
                  రైతు సేతు
                </p>
              </div>
            </Link>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold leading-tight text-white">
                Bridging Farmers and Markets
              </h2>
              <p className="max-w-md text-base text-paddy-100">
                A smarter way to connect, trade and grow together. Eliminate intermediaries and sell directly.
              </p>
            </div>
          </div>

          {/* Green Statistics overlay block at bottom */}
          <div className="rounded-2xl bg-paddy-900/90 p-6 backdrop-blur-lg border border-paddy-700/50 shadow-2xl">
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div className="flex items-start gap-3.5">
                <div className="mt-1 rounded-lg bg-paddy-800/80 p-2 text-paddy-300">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">2L+</div>
                  <div className="text-xs text-paddy-200">Farmers Connected</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3.5">
                <div className="mt-1 rounded-lg bg-paddy-800/80 p-2 text-paddy-300">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">10K+</div>
                  <div className="text-xs text-paddy-200">Daily Transactions</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-1 rounded-lg bg-paddy-800/80 p-2 text-paddy-300">
                  <Store size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">50K+</div>
                  <div className="text-xs text-paddy-200">Active Buyers</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-1 rounded-lg bg-paddy-800/80 p-2 text-paddy-300">
                  <Sprout size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">15K+</div>
                  <div className="text-xs text-paddy-200">Tons Food Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Login Form ────────────────────────────────── */}
      <div className="flex w-full flex-col justify-between bg-white px-6 py-8 lg:w-1/2 sm:px-12 md:px-20">
        
        {/* Language Selector Header Row */}
        <div className="flex justify-end">
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none"
            >
              <Globe size={16} className="text-neutral-500" />
              {language}
              <svg className="-mr-1 h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Login Form Content Container */}
        <div className="mx-auto my-auto w-full max-w-md space-y-8">
          
          {/* Form Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paddy-50 text-paddy-800">
              <CircleUser size={36} className="stroke-[1.5]" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">
              Welcome Back!
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Login to continue to Raithu Sethu
            </p>
          </div>

          {/* Form Card */}
          <div className="space-y-6">
            
            {/* Role Toggle Switch */}
            <div className="flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/50">
              <button
                type="button"
                onClick={() => { setRole("farmer"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                  role === "farmer"
                    ? "bg-paddy-800 text-white shadow-sm"
                    : "text-neutral-600 hover:text-paddy-800"
                }`}
              >
                <Sprout size={16} /> Farmer
              </button>
              <button
                type="button"
                onClick={() => { setRole("buyer"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                  role === "buyer"
                    ? "bg-paddy-800 text-white shadow-sm"
                    : "text-neutral-600 hover:text-paddy-800"
                }`}
              >
                <Store size={16} /> Buyer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address Input Block */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm placeholder-neutral-400 shadow-sm focus:border-paddy-500 focus:outline-none focus:ring-1 focus:ring-paddy-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Mail size={16} className="text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Password Input Block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-paddy-700 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm placeholder-neutral-400 shadow-sm focus:border-paddy-500 focus:outline-none focus:ring-1 focus:ring-paddy-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-paddy-800 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-paddy-700 active:scale-[0.98] disabled:opacity-75"
              >
                <Lock size={15} />
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Divider OR */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <span className="relative bg-white px-4 text-xs font-semibold text-neutral-400 uppercase">
                Or
              </span>
            </div>

            {/* Third-party buttons row */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-[0.98]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-[0.98]"
              >
                <Mail size={16} className="text-neutral-500" />
                Login with OTP
              </button>
            </div>

            {/* Bottom Register Link */}
            <div className="text-center text-sm">
              <span className="text-neutral-500">Don't have an account? </span>
              <Link
                to="/register"
                className="font-bold text-paddy-700 hover:text-paddy-800 hover:underline"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>

        {/* ── FOOTER: Trust Badges and Security Disclaimer ──────────── */}
        <div className="mt-8 border-t border-neutral-100 pt-6 space-y-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-neutral-50 p-1.5 text-paddy-700">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[10px] font-semibold text-neutral-500">Secure & Safe</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-neutral-50 p-1.5 text-paddy-700">
                <Award size={18} />
              </div>
              <span className="text-[10px] font-semibold text-neutral-500">Verified Users</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-neutral-50 p-1.5 text-paddy-700">
                <Handshake size={18} />
              </div>
              <span className="text-[10px] font-semibold text-neutral-500">Fair Trade</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-neutral-50 p-1.5 text-paddy-700">
                <Headset size={18} />
              </div>
              <span className="text-[10px] font-semibold text-neutral-500">24/7 Support</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-center text-xs text-neutral-400">
            <ShieldCheck size={13} className="text-paddy-600" />
            <span>Your data is safe with us. We <strong>Never</strong> share your information.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

