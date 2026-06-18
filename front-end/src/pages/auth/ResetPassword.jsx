import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/auth";
import { extractErrorMessage } from "../../utils/format";
import Button from "../../components/common/Button";
import { Field, Input } from "../../components/common/Field";
import { useToast } from "../../context/ToastContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to reset password."));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="text-center">
          <p className="text-sm text-terracotta-500">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="mt-2 inline-block text-sm font-semibold text-paddy-700">
            Request a new reset link
          </Link>
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
          <p className="mt-2 text-sm text-ink-soft">Set a new password</p>
        </div>

        <div className="rounded-2xl border border-paddy-100 bg-white p-6 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="New Password" required>
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                required
              />
            </Field>
            <Field label="Confirm Password" required>
              <Input
                type="password"
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                minLength={6}
                required
              />
            </Field>

            {error && <p className="text-sm font-medium text-terracotta-500">{error}</p>}

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
