import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BadgeCheckIcon,
  PlusIcon,
  type LucideIcon,
} from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiX,
} from "@icons-pack/react-simple-icons";
import { PLATFORMS } from "../assets/assets";
import api from "../api/axios";
import PlatformPickerModal from "../components/Home/PlatformPickerModal";

type ConnectedAccount = {
  _id: string;
  handle?: string;
  username?: string;
  platform: string;
  status: string;
  avatarUrl?: string;
};

type IconComponent = LucideIcon | React.ComponentType<{ className?: string }>;

const platformIcons: Record<string, IconComponent> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  facebook_page: SiFacebook,
  twitter: SiX,
};

const formatPlatform = (platform: string) =>
  platform
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

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
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load accounts",
      );
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get("connected");
    const connectedUsername = params.get("username");
    const syncNeeded = params.get("sync") === "true";
    const errorMsg = params.get("error");

    window.history.replaceState({}, document.title, window.location.pathname);

    if (connectedPlatform) {
      const label =
        connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
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
  }, []);

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    try {
      const { data } = await api.get(`/api/oauth/${platformId}`);
      window.location.href = data.url || data.authUrl;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          `Failed to connect ${platformId}`,
      );
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await api.delete(`/api/accounts/${accountId}`);
      toast.success("Account disconnected");
      await fetchAccounts();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to disconnect account",
      );
    }
  };

  const connectedIds = accounts.map((account) => account.platform);

  return (
    <>
      <section className="w-full max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Connected Accounts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {accounts.length} of {PLATFORMS.length} platforms connected
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-500 px-6 text-sm font-semibold text-white shadow-sm shadow-red-500/25 transition hover:bg-red-600 sm:min-w-44"
            onClick={() => setShowPlatformPicker(true)}
          >
            <PlusIcon className="size-4" />
            Connect Account
          </button>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {accounts.map((account) => {
            const Icon = platformIcons[account.platform];
            const label = formatPlatform(account.platform);
            const username = account.handle || account.username || "Unknown";

            return (
              <div
                key={account._id}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  {Icon ? (
                    <Icon className="size-6" />
                  ) : (
                    <span className="text-xl font-bold leading-none text-slate-600">
                      {account.platform.includes("linkedin")
                        ? "in"
                        : label.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-slate-900">
                    {username}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-teal-500">
                  <span>Connected</span>
                  <button
                    type="button"
                    className="rounded-full p-1 text-teal-500 transition hover:bg-rose-50 hover:text-rose-500"
                    onClick={() => handleDisconnect(account._id)}
                    aria-label={`Disconnect ${label}`}
                  >
                    <BadgeCheckIcon className="size-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {accounts.length === 0 && (
          <div className="mt-7 rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-base font-semibold text-slate-800">
              No connected accounts
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Connect a platform to start scheduling posts.
            </p>
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
