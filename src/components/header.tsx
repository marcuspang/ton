import { TonConnectButton } from "@tonconnect/ui-react";
import { DropletIcon } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 flex items-center justify-between border-b p-2 px-4 shadow-sm dark:bg-zinc-900">
      <div className="w-full flex">
        <div className="flex basis-8/12 items-center justify-start">
          <DropletIcon className="h-8 w-8 transition-opacity hover:opacity-80" />
        </div>
        <div className="flex basis-4/12 flex-row items-center justify-end">
          <TonConnectButton />
        </div>
      </div>
    </header>
  );
}
