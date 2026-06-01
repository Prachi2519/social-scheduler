import { useState } from "react";
import { BadgeCheckIcon, PlusIcon } from "lucide-react";
import { SiInstagram } from "@icons-pack/react-simple-icons";
import PlatformPickerModal from "../components/Home/PlatformPickerModal";

const initialConnectedAccounts = [
  { username: "greatstack", platform: "Instagram", icon: SiInstagram },
  { username: "Greatstack", platform: "LinkedIn", iconText: "in" },
];

export default function Accounts() {
  const [isPlatformPickerOpen, setIsPlatformPickerOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);

  const disconnectAccount = (platform: string) => {
    setConnectedAccounts((accounts) => accounts.filter((account) => account.platform !== platform));
  };

  return (
    <>
      <section className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Connected Accounts</h2>
            <p className="mt-2 text-base font-medium text-slate-500">{connectedAccounts.length} of 4 platforms connected</p>
          </div>

          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-500 px-7 text-sm font-semibold text-white shadow-sm shadow-red-500/25 transition hover:bg-red-600 sm:min-w-48"
            onClick={() => setIsPlatformPickerOpen(true)}
          >
            <PlusIcon className="size-4" />
            Connect Account
          </button>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {connectedAccounts.map(({ username, platform, icon: Icon, iconText }) => (
            <div key={platform} className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 shadow-sm">
                {Icon ? <Icon className="size-7" /> : <span className="text-2xl font-bold leading-none text-slate-600">{iconText}</span>}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-slate-900">{username}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{platform}</p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-teal-500">
                <span>Connected</span>
                <button
                  type="button"
                  className="rounded-full p-1 text-teal-500 transition hover:bg-rose-50 hover:text-rose-500"
                  onClick={() => disconnectAccount(platform)}
                  aria-label={`Disconnect ${platform}`}
                >
                  <BadgeCheckIcon className="size-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isPlatformPickerOpen && <PlatformPickerModal onClose={() => setIsPlatformPickerOpen(false)} />}
    </>
  );
}
