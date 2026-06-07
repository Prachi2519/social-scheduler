import {
  BadgeCheckIcon,
  ExternalLinkIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
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
    description: "Tweets, threads, and media",
    icon: SiX,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Profiles and company pages",
    iconText: "in",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Pages and profile publishing",
    icon: SiFacebook,
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Photos, reels, and stories",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <div className="panel-solid w-full max-w-xl overflow-hidden rounded-lg shadow-[0_24px_80px_rgba(23,21,19,0.24)]">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-stone-400">
              New channel
            </p>
            <h2 className="text-xl font-semibold text-stone-950">
              Choose a platform
            </h2>
          </div>
          <button
            type="button"
            className="focus-ring rounded-lg p-2 text-stone-400 transition hover:bg-stone-950/5 hover:text-stone-700"
            onClick={onClose}
            aria-label="Close platform picker"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="grid gap-3 p-5">
          {platforms.map(({ id, name, description, icon: Icon, iconText }) => {
            const connected = connectedIds.includes(id);
            const isConnecting = connecting === id;

            return (
              <button
                key={id}
                type="button"
                disabled={connected || isConnecting}
                onClick={() => onConnect?.(id)}
                className="focus-ring grid w-full grid-cols-[2.75rem_1fr_auto] items-center gap-4 rounded-lg border border-stone-200 bg-white/75 px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div
                  className={[
                    "flex size-11 items-center justify-center rounded-lg",
                    connected
                      ? "bg-[#e9f8f2] text-[var(--mint)]"
                      : "bg-stone-950/[0.04] text-stone-700",
                  ].join(" ")}
                >
                  {Icon ? (
                    <Icon className="size-6" />
                  ) : (
                    <span className="text-xl font-bold leading-none">
                      {iconText}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-stone-900">{name}</p>
                  <p className="mt-1 text-sm font-medium text-stone-500">
                    {connected
                      ? "Already connected"
                      : isConnecting
                        ? "Opening authorization"
                        : description}
                  </p>
                </div>

                <div className="flex justify-end">
                  {connected ? (
                    <BadgeCheckIcon className="size-5 text-[var(--mint)]" />
                  ) : isConnecting ? (
                    <Loader2Icon className="size-5 animate-spin text-stone-400" />
                  ) : (
                    <ExternalLinkIcon className="size-5 text-stone-300" />
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
