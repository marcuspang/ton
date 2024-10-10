import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { useTokens } from "@/hooks/use-tokens";
import { getQuote, postSwapMessages, type SwapDetails } from "@/lib/backend";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { ChevronDownIcon, ChevronUpIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import truncateMiddle from "truncate-middle";

// TODO: add tokens to search params
export default function SwapPage() {
  const { data: tokens } = useTokens();
  const [inToken, setInToken] = useState<string>("");
  const [inTokenAmount, setInTokenAmount] = useState<number>(0);
  const [outToken, setOutToken] = useState<string>("");
  const [slippage, _setSlippage] = useState<number>(0.5); // in %
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const { mutate: submitOrder, isPending: isSubmitOrderPending } = useMutation({
    mutationFn: (swapDetails: SwapDetails) =>
      postSwapMessages({ senderAddress: address, swapDetails }),
    onSuccess: (data) => {
      tonConnectUI.sendTransaction(data);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  const { data: quote, isPending: isQuotePending } = useQuery({
    queryKey: ["quote", inToken, outToken, inTokenAmount],
    queryFn: () =>
      getQuote({
        inputMint: inToken,
        outputMint: outToken,
        amount: inTokenAmount,
      }),
    enabled: !!inToken && !!outToken && !!inTokenAmount,
  });

  function onSubmitSwap() {
    if (!quote) {
      return;
    }
    submitOrder(quote);
  }

  return (
    <main className="grid w-full max-w-md gap-6 p-6 mx-auto mt-8 border shadow-sm rounded-xl bg-background">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Swap</h2>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <SettingsIcon className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between space-x-2">
            <VirtualizedCombobox
              options={
                tokens?.map((token) => ({
                  value: token,
                  label: truncateMiddle(token, 6, 6, "..."),
                })) ?? []
              }
              width="100%"
              searchPlaceholder="Selling Token"
              selectedOption={inToken}
              setSelectedOption={setInToken}
            />
            <Input
              type="number"
              placeholder="0.0"
              className="w-16 text-right"
              value={inTokenAmount}
              onChange={(e) => {
                setInTokenAmount(parseFloat(e.target.value));
              }}
              // max={inTokenBalance !== undefined ? inTokenBalance.toString() : 0}
            />
          </div>
          <div className="text-center">
            <Button
              variant="ghost"
              className="h-auto px-1 py-1"
              onClick={() => setIsBuy((prev) => !prev)}
            >
              {isBuy ? (
                <ChevronDownIcon className={"h-4 w-4 transition-all"} />
              ) : (
                <ChevronUpIcon className={"h-4 w-4 transition-all"} />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <VirtualizedCombobox
              options={
                tokens?.map((token) => ({
                  value: token,
                  label: truncateMiddle(token, 6, 6, "..."),
                })) ?? []
              }
              width="100%"
              searchPlaceholder="Buying Token"
              selectedOption={outToken}
              setSelectedOption={setOutToken}
            />
          </div>
        </div>
        <Button
          className="w-full"
          onClick={onSubmitSwap}
          disabled={isSubmitOrderPending || inTokenAmount === 0 || !quote}
        >
          {inTokenAmount === 0
            ? "Enter Amounts"
            : isQuotePending
            ? "Getting Quote..."
            : !quote
            ? "No Quote Found"
            : isSubmitOrderPending
            ? "Submitting..."
            : "Submit Swap"}
        </Button>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Price</span>
          <span className="text-right">
            {inToken &&
              `Selling ${inTokenAmount} (${truncateMiddle(
                inToken,
                6,
                6,
                "..."
              )})`}
            {outToken &&
              quote &&
              ` for
            ${quote.expectedAmountOut}
            (${truncateMiddle(outToken, 6, 6, "...")})`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Minimum Received</span>
          <span>{quote?.minimumAmountOut}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Slippage</span>
          <span>{slippage}%</span>
        </div>
      </div>
      <Toaster />
    </main>
  );
}
