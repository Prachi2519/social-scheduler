import { BadgeCheckIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

type PlatformPickerModalProps = {
  connectedIds?: string[];
  connecting?: string | null;
  onClose: () => void;
  onConnect?: (platformId: string) => void;
};

const platforms = [
  {
    id: "twitter",
    name: "Twitter / X",
    description: "Post tweets, threads, and media",
    icon: SiX,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Connect your LinkedIn account",
    iconText: "in",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Manage your pages and profile",
    icon: SiFacebook,
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram account",
    icon: SiInstagram,
  },
];

export default function PlatformPickerModal({
  connectedIds = [],
  connecting,
  onClose,
  onConnect,
}: PlatformPickerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <h2 className="text-lg font-semibold text-slate-900">Choose a Platform</h2>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            aria-label="Close platform picker"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="space-y-3 px-7 py-6">
          {platforms.map(({ id, name, description, icon: Icon, iconText }) => {
            const connected = connectedIds.includes(id);
            const isConnecting = connecting === id;

            return (
              <button
                key={id}
                type="button"
                disabled={connected || isConnecting}
                onClick={() => onConnect?.(id)}
                className="grid w-full grid-cols-[2.5rem_1fr_2rem] items-center gap-5 rounded-xl px-3 py-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-75"
              >
                <div className="flex size-10 items-center justify-center text-slate-500">
                  {Icon ? <Icon className="size-7" /> : <span className="text-2xl font-bold leading-none text-slate-600">{iconText}</span>}
                </div>

                <div className="text-center">
                  <p className={connected ? "font-semibold text-rose-500" : "font-semibold text-slate-800"}>{name}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {connected
                      ? "Already connected"
                      : isConnecting
                        ? "Connecting..."
                        : description}
                  </p>
                </div>

                <div className="flex justify-end">
                  {connected ? (
                    <BadgeCheckIcon className="size-5 text-rose-400" />
                  ) : (
                    <ExternalLinkIcon className="size-5 text-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
