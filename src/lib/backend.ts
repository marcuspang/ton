export interface SwapDetails {
  amountIn: string;
  expectedAmountOut: string;
  minimumAmountOut: string;
  inputMint: string;
  outputMint: string;
  pathDetails: SwapPath[];
}

export interface SwapPath {
  poolSource: string;
  path: string[];
  edges: SwapEdge[];
  amountIn: string;
  amountOut: string;
  minimumAmountOut: string;
  percent: number;
}

export interface SwapEdge {
  poolAddress: string;
  poolAmm: string;
  poolType: string;
  tokenIn: string;
  tokenOut: string;
  poolTokenInBalance: string;
  poolTokenOutBalance: string;
  poolFeeBps: string;
  minimumAmountOut: string;
}

export interface SwapMessagesResponse {
  validUntil: number;
  messages: [
    {
      address: string;
      amount: string;
      sendMode: number;
      payload: string;
    }
  ];
}

/**
 *
 * Response: [
 *  "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
 *  ...
 * ]
 */
export async function getAllTokens(): Promise<string[]> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/tokens`);
  const data = await response.json();
  return data;
}

/**
 *
 * Response: [
 *  "StonFi_v1",
 *  "StonFi_v2_1",
 *  "DeDust"
 * ]
 */
export async function getAllDexes(): Promise<string[]> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/dexes`);
  const data = await response.json();
  return data;
}

/**
 * @param inputMint - The input mint address (can be user-friendly format or raw)
 * @param outputMint - The output mint address (can be user-friendly format or raw)
 * @param amount - The amount to swap (must be in raw format)
 * @param maxSplitPaths - The maximum number of split paths
 * @param maxEdgeLength - The maximum edge length (maximum number of hops allowed)
 * @param slippageBps - Slippage allowed in basis points (e.g., 250 for 2.5% slippage)
 * @param dexs - Comma-separated list of DEXs to use for routing the swap
 */
export async function getQuote({
  inputMint,
  outputMint,
  amount,
  maxSplitPaths,
  maxEdgeLength,
  slippageBps,
  dexs,
}: {
  inputMint: string;
  outputMint: string;
  amount: number;
  maxSplitPaths?: number;
  maxEdgeLength?: number;
  slippageBps?: string;
  dexs?: string;
}): Promise<SwapDetails> {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
    ...(maxSplitPaths && { maxSplitPaths: maxSplitPaths.toString() }),
    ...(maxEdgeLength && { maxEdgeLength: maxEdgeLength.toString() }),
    ...(slippageBps && { slippageBps }),
    ...(dexs && { dexs }),
  });

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v1/quote?${params}`
  );
  const data = await response.json();
  return data;
}

/**
 * @param senderAddress - The address of the sender
 * @param swapDetails - The details of the swap, including input/output amounts, mints, and path details
 * @returns An object containing validUntil timestamp and an array of messages
 */
export async function postSwapMessages({
  senderAddress,
  swapDetails,
}: {
  senderAddress: string;
  swapDetails: SwapDetails;
}): Promise<SwapMessagesResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v1/swap-messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderAddress,
        swapDetails,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Error status: ${response.status}`);
  }

  const data = await response.json();
  if (response.status !== 200) {
    console.error(data);
    throw new Error(data.error);
  }
  return data;
}
