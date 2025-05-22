import { invariant } from "@soe511/shared-frontend/utils";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import { env } from "@soe511/shared-frontend/env";
import { erc20Abi, type PublicClient, type WalletClient } from "viem";
import {
	AllowanceTransfer,
	AllowanceProvider,
	MaxAllowanceTransferAmount,
	MaxSigDeadline,
	MaxAllowanceExpiration,
	type PermitSingle,
} from "permit2-sdk-viem";
import { Result, type Unit } from "true-myth";
import type { Plan } from "@soe511/shared-frontend/types";

const PERMIT_DETAILS = [
	{ name: "token", type: "address" },
	{ name: "amount", type: "uint160" },
	{ name: "expiration", type: "uint48" },
	{ name: "nonce", type: "uint48" },
] as const;

const PERMIT_TYPES = {
	PermitDetails: PERMIT_DETAILS,
	PermitSingle: [
		{ name: "details", type: "PermitDetails" },
		{ name: "spender", type: "address" },
		{ name: "sigDeadline", type: "uint256" },
	],
} as const;

export const purchasePlan = async ({
	plan,
	walletClient,
	publicClient,
}: {
	plan: Plan;
	walletClient: WalletClient;
	publicClient: PublicClient;
}): Promise<Result<Unit, Unit>> => {
	invariant(walletClient.chain, "ERR_WALLET_CLIENT_CHAIN");
	invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");

	try {
		const tokenAllowance = await publicClient.readContract({
			address: env.VITE_USDC_CONTRACT_ADDRESS,
			abi: erc20Abi,
			functionName: "allowance",
			args: [walletClient.account.address, env.VITE_PERMIT2_CONTRACT_ADDRESS],
		});

		if (tokenAllowance === 0n || tokenAllowance < plan.price) {
			const { request } = await publicClient.simulateContract({
				address: env.VITE_USDC_CONTRACT_ADDRESS,
				abi: erc20Abi,
				functionName: "approve",
				args: [env.VITE_PERMIT2_CONTRACT_ADDRESS, MaxAllowanceTransferAmount],
				chain: walletClient.chain,
				account: walletClient.account,
			});

			await walletClient.writeContract(request);
		}

		const allowanceProvider = new AllowanceProvider(
			publicClient,
			env.VITE_PERMIT2_CONTRACT_ADDRESS,
		);

		const permit2Allowance = await allowanceProvider.getAllowance(
			env.VITE_USDC_CONTRACT_ADDRESS,
			walletClient.account.address,
			env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
		);

		const nonce = await allowanceProvider.getNonce(
			env.VITE_USDC_CONTRACT_ADDRESS,
			walletClient.account.address,
			env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
		);

		if (permit2Allowance === 0n || permit2Allowance < plan.price) {
			const permit: PermitSingle = {
				details: {
					nonce,
					token: env.VITE_USDC_CONTRACT_ADDRESS,
					amount: MaxAllowanceTransferAmount,
					expiration: Number(MaxAllowanceExpiration),
				},
				spender: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				sigDeadline: MaxSigDeadline,
			};

			const { domain, values } = AllowanceTransfer.getPermitSingleData(
				permit,
				env.VITE_PERMIT2_CONTRACT_ADDRESS,
				walletClient.chain.id,
			);

			const signature = await walletClient.signTypedData({
				domain,
				types: PERMIT_TYPES,
				primaryType: "PermitSingle",
				message: values,
				account: walletClient.account,
			});

			const { request } = await publicClient.simulateContract({
				address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				abi: insuranceInstitutionAbi,
				functionName: "permitAndPurchasePlan",
				// biome-ignore lint/suspicious/noExplicitAny: this doesn't work no matter how much I typecast it
				args: [permit as any, signature, plan.id],
				chain: walletClient.chain,
				account: walletClient.account,
			});

			await walletClient.writeContract(request);
		} else {
			const { request } = await publicClient.simulateContract({
				address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				abi: insuranceInstitutionAbi,
				functionName: "purchasePlan",
				args: [plan.id],
				chain: walletClient.chain,
				account: walletClient.account,
			});

			await walletClient.writeContract(request);
		}

		return Result.ok();
	} catch (err) {
		console.warn(err);
		return Result.err();
	}
};
