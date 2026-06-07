import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import toast from "react-hot-toast";
import {
  BadgeCheckIcon,
  CircleDashedIcon,
  ExternalLinkIcon,
  PlusIcon,
  RadioTowerIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { PLATFORMS } from "../assets/assets";
import api from "../api/axios";
import PlatformPickerModal from "../components/Home/PlatformPickerModal";

type ConnectedAccount = {
  _id: string;
  avatarUrl?: string;
  handle?: string;
  platform: string;
  status: string;
  username?: string;
};

type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

const platformIcons: Record<string, IconComponent> = {
  facebook: SiFacebook,
  facebook_page: SiFacebook,
  instagram: SiInstagram,
  twitter: SiX,
};

const normalizePlatform = (platform: string) =>
  platform === "facebook_page" ? "facebook" : platform;

const formatPlatform = (platform: string) =>
  platform
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  const maybeError = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };

  return maybeError.response?.data?.message || maybeError.message || fallback;
};

const Accounts = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  const fetchAccounts = async (
    isSync = false,
    platform?: string | null,
    successMsg?: string,
  ) => {
    try {
      if (isSync) {
        const label = platform
          ? platform.charAt(0).toUpperCase() + platform.slice(1)
          : "Social Media";
        toast.loading(`Syncing ${label} account...`, { id: "sync" });
        await api.get("/api/oauth/accounts/sync");
        toast.success(successMsg || "Accounts synced!", { id: "sync" });
      }

      const { data } = await api.get("/api/accounts");
      setAccounts(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load accounts"));
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const connectedPlatform = params.get("connected");
      const connectedUsername = params.get("username");
      const syncNeeded = params.get("sync") === "true";
      const errorMsg = params.get("error");

      window.history.replaceState({}, document.title, window.location.pathname);

      if (connectedPlatform) {
        const label =
          connectedPlatform.charAt(0).toUpperCase() +
          connectedPlatform.slice(1);
        const handle = connectedUsername ? ` (@${connectedUsername})` : "";
        fetchAccounts(true, connectedPlatform, `${label}${handle} connected!`);
      } else if (errorMsg) {
        toast.error(`Connection failed: ${decodeURIComponent(errorMsg)}`);
        fetchAccounts();
      } else if (syncNeeded) {
        fetchAccounts(true, null, "Accounts synced!");
      } else {
        fetchAccounts();
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    try {
      const { data } = await api.get<{ authUrl?: string; url?: string }>(
        `/api/oauth/${platformId}`,
      );
      const redirectUrl = data.url || data.authUrl;

      if (!redirectUrl) {
        throw new Error(`No authorization URL returned for ${platformId}`);
      }

      window.location.assign(redirectUrl);
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to connect ${platformId}`));
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await api.delete(`/api/accounts/${accountId}`);
      toast.success("Account disconnected");
      await fetchAccounts();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to disconnect account"));
    }
  };

  const accountsByPlatform = useMemo(() => {
    const platformMap = new Map<string, ConnectedAccount>();
    accounts.forEach((account) => {
      platformMap.set(normalizePlatform(account.platform), account);
    });

    return platformMap;
  }, [accounts]);

  const connectedIds = [...accountsByPlatform.keys()];
  const connectedCount = connectedIds.length;
  const completion = Math.round((connectedCount / PLATFORMS.length) * 100);

  return (
    <>
      <section className="space-y-6">
        <div className="panel reveal-up rounded-lg p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase text-stone-500">
                <RadioTowerIcon className="size-3.5 text-[var(--mint)]" />
                Channel readiness
              </div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] text-stone-950 sm:text-5xl">
                Bring every audience into one publishing flow.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                Connected accounts stay visible, missing channels are one action
                away, and platform rules remain easy to scan.
              </p>
            </div>

            <div className="grid min-w-72 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-lg border border-stone-200 bg-white/75 p-4">
                <p className="text-sm font-semibold text-stone-500">
                  Coverage
                </p>
                <p className="mt-2 text-4xl font-semibold text-stone-950">
                  {completion}%
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-[var(--mint)]"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="surface-inverse focus-ring flex min-h-32 flex-col justify-between rounded-lg p-4 text-left shadow-[0_12px_28px_rgba(23,21,19,0.16)] transition hover:-translate-y-0.5"
                onClick={() => setShowPlatformPicker(true)}
              >
                <PlusIcon className="size-5 text-[#ffd36e]" />
                <span className="text-sm font-semibold">Connect account</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {PLATFORMS.map((platform) => {
            const account = accountsByPlatform.get(platform.id);
            const isConnected = Boolean(account);
            const Icon = platformIcons[account?.platform || platform.id] || platform.icon;
            const username =
              account?.handle || account?.username || "Awaiting profile";

            return (
              <article
                key={platform.id}
                className="panel-solid lift-card rounded-lg p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-4">
                    <div
                      className={[
                        "flex size-12 shrink-0 items-center justify-center rounded-lg",
                        isConnected
                          ? "surface-inverse"
                          : "bg-stone-950/[0.04] text-stone-500",
                      ].join(" ")}
                    >
                      <Icon className="size-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-stone-950">
                          {platform.name}
                        </h3>
                        {isConnected ? (
                          <BadgeCheckIcon className="size-4 text-[var(--mint)]" />
                        ) : (
                          <CircleDashedIcon className="size-4 text-stone-400" />
                        )}
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-stone-500">
                        {isConnected ? username : platform.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={[
                      "size-2.5 shrink-0 rounded-full",
                      isConnected ? "bg-[var(--mint)]" : "bg-stone-300",
                    ].join(" ")}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-stone-950/[0.035] p-3">
                    <p className="text-xs font-semibold uppercase text-stone-400">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-800">
                      {isConnected ? "Connected" : "Ready"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-stone-950/[0.035] p-3">
                    <p className="text-xs font-semibold uppercase text-stone-400">
                      Access
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-stone-800">
                      <ShieldCheckIcon className="size-3.5 text-[var(--sky)]" />
                      OAuth
                    </p>
                  </div>
                  <div className="rounded-lg bg-stone-950/[0.035] p-3">
                    <p className="text-xs font-semibold uppercase text-stone-400">
                      Sync
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-stone-800">
                      <RefreshCwIcon className="size-3.5 text-[var(--amber)]" />
                      Live
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {isConnected && account ? (
                    <button
                      type="button"
                      className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-600 transition hover:border-[var(--coral)] hover:text-[var(--coral)]"
                      onClick={() => handleDisconnect(account._id)}
                    >
                      <Trash2Icon className="size-4" />
                      Disconnect
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={connecting === platform.id}
                      className="surface-inverse focus-ring inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-60"
                      onClick={() => handleConnect(platform.id)}
                    >
                      {connecting === platform.id ? (
                        <RefreshCwIcon className="size-4 animate-spin" />
                      ) : (
                        <ExternalLinkIcon className="size-4" />
                      )}
                      {connecting === platform.id ? "Connecting" : "Connect"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {accounts.length > 0 && (
          <div className="panel-solid rounded-lg">
            <div className="border-b border-stone-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-stone-950">
                Connected profiles
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {accounts.map((account) => {
                const normalized = normalizePlatform(account.platform);
                const Icon = platformIcons[account.platform];
                const label = formatPlatform(account.platform);
                const username =
                  account.handle || account.username || "Unknown profile";

                return (
                  <div
                    key={account._id}
                    className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-stone-950/[0.04] text-stone-700">
                        {Icon ? (
                          <Icon className="size-5" />
                        ) : (
                          <span className="text-sm font-bold">
                            {normalized === "linkedin" ? "in" : label.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-950">
                          {username}
                        </p>
                        <p className="text-sm text-stone-500">{label}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="focus-ring inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold text-stone-600 transition hover:border-[var(--coral)] hover:text-[var(--coral)]"
                      onClick={() => handleDisconnect(account._id)}
                    >
                      <Trash2Icon className="size-4" />
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {showPlatformPicker && (
        <PlatformPickerModal
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}
    </>
  );
};

export default Accounts;
