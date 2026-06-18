import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/format";
import { 
  Sprout, 
  Store, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  ArrowLeft
} from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState("farmer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    farm_size: "",
    company_name: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = role === "farmer"
        ? {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            location: form.location,
            farm_size: form.farm_size ? Number(form.farm_size) : undefined,
          }
        : {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            company_name: form.company_name,
          };
      await register(role, payload);
      toast.success("Account created successfully!");
      navigate(role === "farmer" ? "/farmer/dashboard" : "/buyer/marketplace");
    } catch (err) {
      setError(extractErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 font-sans relative overflow-hidden">
      {/* Soft decorative background circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-paddy-100/30 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-100/30 blur-3xl -z-10"></div>

      <div className="w-full max-w-xl">
        
        {/* Back navigation button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-paddy-800 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Logo and header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex flex-col items-center">
            <span className="font-display text-4xl font-bold tracking-tight text-paddy-800">
              రైతు సేతు
            </span>
            <span className="font-display text-sm font-medium text-paddy-600 mt-1">
              Raithu Sethu
            </span>
          </Link>
          <p className="mt-3 text-sm text-neutral-500">
            Join the direct farm-to-buyer ecosystem
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-paddy-100 bg-white p-6 shadow-xl shadow-neutral-100/50 sm:p-8">
          
          {/* Role selection tab */}
          <div className="mb-6 flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/50">
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
            
            {/* Full Name field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm placeholder-neutral-400 shadow-sm focus:border-paddy-500 focus:outline-none focus:ring-1 focus:ring-paddy-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <User size={16} className="text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Email and Phone fields grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm placeholder-neutral-400 shadow-sm focus:border-paddy-500 focus:outline-none focus:ring-1 focus:ring-paddy-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Mail size={16} className="text-neutral-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm placeholder-neutral-400 shadow-sm focus:border-paddy-500 focus:outline-none focus:ring-1 focus:ring-paddy-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Phone size={16} className="text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  minLength={6}
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

            {/* Role-Specific fields */}
            {role === "farmer" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                    Farm Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="District, State"
                      required
                      className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm placeholder-neutral-400 shadow-sm focus:border-paddy-500 focus:outline-none focus:ring-1 focus:ring-paddy-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin size={16} className="text-neutral-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                    Farm Size <span className="text-neutral-400 font-normal lowercase">(acres, optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="farm_size"
                      value={form.farm_size}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                      className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm placeholder-neutral-400 shadow-sm focus:border-paddy-500 focus:outline-none focus:ring-1 focus:ring-paddy-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FileText size={16} className="text-neutral-400" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    placeholder="Enter company or shop name"
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm placeholder-neutral-400 shadow-sm focus:border-paddy-500 focus:outline-none focus:ring-1 focus:ring-paddy-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Store size={16} className="text-neutral-400" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-paddy-800 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-paddy-700 active:scale-[0.98] disabled:opacity-75"
            >
              <Sprout size={15} />
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Already have account */}
          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-paddy-700 hover:text-paddy-800 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Security assurance */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-neutral-400">
          <ShieldCheck size={13} className="text-paddy-600" />
          <span>Secure direct trade infrastructure. We value your privacy.</span>
        </div>

      </div>
    </div>
  );
}
