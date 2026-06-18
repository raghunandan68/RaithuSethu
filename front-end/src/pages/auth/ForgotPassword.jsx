import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import { extractErrorMessage } from "../../utils/format";
import Button from "../../components/common/Button";
import { Field, Input } from "../../components/common/Field";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      if (res.data?.reset_token) {
        setSent(true);
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to send reset email."));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Link to="/" className="font-display text-3xl font-semibold text-paddy-800">
              రైతు సేతు
            </Link>
          </div>
          <div className="rounded-2xl border border-paddy-100 bg-white p-8 shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paddy-100">
              <Mail size={24} className="text-paddy-700" />
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">Check your email</h2>
            <p className="mt-2 text-sm text-ink-soft">
              If an account exists with <strong>{email}</strong>, you&apos;ll receive password reset instructions.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-paddy-700 hover:text-paddy-800"
            >
              <ArrowLeft size={16} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="font-display text-3xl font-semibold text-paddy-800">
            రైతు సేతు
          </Link>
          <p className="mt-2 text-sm text-ink-soft">Reset your password</p>
        </div>

        <div className="rounded-2xl border border-paddy-100 bg-white p-6 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email address" required>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            {error && <p className="text-sm font-medium text-terracotta-500">{error}</p>}

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Send Reset Link
            </Button>
          </form>

          <Link
            to="/login"
            className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-soft hover:text-paddy-700"
          >
            <ArrowLeft size={16} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
