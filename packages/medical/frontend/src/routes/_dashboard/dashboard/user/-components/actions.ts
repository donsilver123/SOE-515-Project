import { medicalInstitutionAbi } from "@soe511/shared-frontend/abi";
import { env } from "@soe511/shared-frontend/env";
import { erc20Abi, type PublicClient, type WalletClient } from "viem";
import { Result, type Unit } from "true-myth";
import type { Service } from "@soe511/shared-frontend/types";
import { invariant } from "@soe511/shared-frontend/utils";

export const processVisit = async ({
	service,
	walletClient,
	publicClient,
}: {
	service: Service;
	walletClient: WalletClient;
	publicClient: PublicClient;
}): Promise<Result<Unit, Unit>> => {
	invariant(walletClient.chain, "ERR_WALLET_CLIENT_CHAIN");
	invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");

	try {
		return Result.ok();
	} catch (err) {
		console.warn(err);
		return Result.err();
	}
};
