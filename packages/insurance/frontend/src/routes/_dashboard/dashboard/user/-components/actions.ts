import { invariant } from "@/lib/utils";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import { env } from "@soe511/shared-frontend/env";
import type { Hex, PublicClient, WalletClient } from "viem";
import {
	AllowanceTransfer,
	AllowanceProvider,
	MaxUint256,
	MaxUint160,
} from "permit2-sdk-viem";

export const purchasePlan = async ({
	planId,
	walletClient,
	publicClient,
}: {
	planId: number;
	walletClient: WalletClient;
	publicClient: PublicClient;
}) => {
	invariant(walletClient.chain, "ERR_WALLET_CLIENT_CHAIN");
	invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");

	const allowanceProvider = new AllowanceProvider(
		publicClient,
		env.VITE_PERMIT2_CONTRACT_ADDRESS,
	);

	const allowance = await allowanceProvider.getAllowance(
		env.VITE_USDC_CONTRACT_ADDRESS,
		walletClient.account.address,
		env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
	);

	const nonce = await allowanceProvider.getNonce(
		env.VITE_USDC_CONTRACT_ADDRESS,
		walletClient.account.address,
		env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
	);

	if (allowance <= 0) {
		const permit = {
			details: {
				nonce,
				token: env.VITE_USDC_CONTRACT_ADDRESS,
				amount: MaxUint160,
				expiration: Number.MAX_VALUE,
			},
			spender: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
			sigDeadline: MaxUint256,
		};

		const hash = AllowanceTransfer.hash(
			permit,
			env.VITE_PERMIT2_CONTRACT_ADDRESS,
			walletClient.chain.id,
		) as Hex;

		const signature = await walletClient.signMessage({
			message: { raw: hash },
			account: walletClient.account,
		});

		await walletClient.writeContract({
			address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
			abi: insuranceInstitutionAbi,
			functionName: "permitAndPurchasePlan",
			args: [permit, signature, BigInt(planId)],
			chain: walletClient.chain,
			account: walletClient.account,
		});
	} else {
		await walletClient.writeContract({
			address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
			abi: insuranceInstitutionAbi,
			functionName: "purchasePlan",
			args: [BigInt(planId)],
			chain: walletClient.chain,
			account: walletClient.account,
		});
	}
};
