import { TonConnectButton } from "@tonconnect/ui-react";
import { DropletIcon } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 flex items-center justify-between p-2 px-4 bg-white border-b shadow-sm dark:bg-zinc-900">
      <div className="flex w-full">
        <div className="flex items-center justify-start basis-8/12">
          <DropletIcon className="w-8 h-8 transition-opacity hover:opacity-80" />
        </div>
        <div className="flex flex-row items-center justify-end basis-4/12">
          <TonConnectButton />
        </div>
      </div>
    </header>
  );
}
