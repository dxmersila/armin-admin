import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../auth/useAuth";

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

export default function LoginPage() {
  const { login, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = location.state as LoginLocationState | null;
  const from = state?.from?.pathname ?? "/admin/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login(email, password);

      if (user.role !== "admin") {
        await logout();
        setError(t("auth.notAuthorized"));
        return;
      }

      navigate(from, { replace: true });
    } catch {
      setError(t("auth.invalidCredentials"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("auth.title")}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("auth.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            {t("auth.email")}
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="w-full rounded-md border border-input bg-surface px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            {t("auth.password")}
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-input bg-surface px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
        </button>
      </form>
    </div>
  );
}
