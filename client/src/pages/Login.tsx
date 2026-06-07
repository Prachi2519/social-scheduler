import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  LockIcon,
  MailIcon,
  RadioTowerIcon,
  User2Icon,
} from "lucide-react";
import toast from "react-hot-toast";
import imgOne from "../assets/img-1.jpg";
import imgTwo from "../assets/img-2.jpg";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  const maybeError = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };

  return maybeError.response?.data?.message || maybeError.message || fallback;
};

export default function Login() {
  const [loginState, setLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post(
        `/api/auth/${loginState ? "login" : "register"}`,
        { email, name, password },
      );

      login(data, data.token);
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "Authentication failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [navigate, user]);

  return (
    <div className="app-surface min-h-screen px-4 py-6 text-stone-950 sm:px-6 lg:px-8">
      <div className="panel-solid mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-lg lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden border-r border-stone-200 p-8 lg:block">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-stone-950">
              <img src="/logo.svg" alt="Logo" className="size-5" />
            </span>
            <span>
              <span className="block text-lg font-semibold leading-none">
                Scheduler
              </span>
              <span className="text-xs font-medium text-stone-500">
                Social operations
              </span>
            </span>
          </Link>

          <div className="mt-16 max-w-lg">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase text-stone-500">
              <CalendarCheckIcon className="size-3.5 text-[var(--mint)]" />
              Publishing desk
            </div>
            <h1 className="text-5xl font-semibold leading-[1.03]">
              Your campaigns should feel composed before they go live.
            </h1>
            <p className="mt-5 text-base leading-7 text-stone-600">
              Sign in to plan channels, preview content, and schedule the week
              from one focused workspace.
            </p>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <div className="grid gap-3 rounded-lg border border-stone-200 bg-white/75 p-3">
              <div className="grid grid-cols-[0.8fr_1fr] gap-3">
                <img
                  src={imgOne}
                  alt=""
                  className="h-44 w-full rounded-lg object-cover"
                />
                <div className="surface-inverse rounded-lg p-4">
                  <RadioTowerIcon className="size-5 text-[#9be7cf]" />
                  <p className="mt-8 text-3xl font-semibold">18</p>
                  <p className="mt-1 text-sm text-white/70">posts queued</p>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_0.72fr] gap-3">
                <div className="rounded-lg border border-stone-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase text-stone-400">
                    Next post
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-stone-700">
                    LinkedIn launch recap, 10:30 AM
                  </p>
                </div>
                <img
                  src={imgTwo}
                  alt=""
                  className="h-28 w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex justify-end">
              <ThemeToggle />
            </div>
            <div className="mb-8 text-center lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="size-7" />
                <span className="text-2xl font-semibold">Scheduler</span>
              </Link>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase text-stone-400">
                {loginState ? "Welcome back" : "Create workspace"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-stone-950">
                {loginState ? "Sign in to continue" : "Start scheduling"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-sm">
              {!loginState && (
                <div>
                  <label className="mb-2 block font-semibold text-stone-700">
                    Name
                  </label>
                  <div className="relative">
                    <User2Icon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="focus-ring h-12 w-full rounded-lg border border-stone-200 bg-white/80 pl-10 pr-4 font-medium text-stone-800 transition placeholder:text-stone-400 focus:border-[var(--coral)]"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block font-semibold text-stone-700">
                  Email
                </label>
                <div className="relative">
                  <MailIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="focus-ring h-12 w-full rounded-lg border border-stone-200 bg-white/80 pl-10 pr-4 font-medium text-stone-800 transition placeholder:text-stone-400 focus:border-[var(--coral)]"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-stone-700">
                  Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="focus-ring h-12 w-full rounded-lg border border-stone-200 bg-white/80 pl-10 pr-4 font-medium text-stone-800 transition placeholder:text-stone-400 focus:border-[var(--coral)]"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--coral)] px-4 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(239,93,79,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--coral-dark)] disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? (
                  "Signing in"
                ) : (
                  <>
                    {loginState ? "Sign in" : "Create account"}
                    <ArrowRightIcon className="size-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-stone-200 bg-white/70 px-4 py-3 text-center text-sm text-stone-500">
              {loginState ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setLoginState(false)}
                    className="font-semibold text-[var(--coral)] hover:text-[var(--coral-dark)]"
                  >
                    Create one free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setLoginState(true)}
                    className="font-semibold text-[var(--coral)] hover:text-[var(--coral-dark)]"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
