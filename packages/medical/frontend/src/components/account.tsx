import { Store } from "@tanstack/store";
import type { WalletClient, PublicClient } from "viem";

export type AccountStore = {
	walletClient: WalletClient;
	publicClient: PublicClient;
};

export const accountStore = new Store({} as AccountStore);
