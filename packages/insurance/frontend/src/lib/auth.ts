import { env } from "@soe511/shared-frontend/env";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import type { PublicClient, WalletClient } from "viem";
import { invariant } from "./utils";
import {
	useMutation,
	useQuery,
	type UseMutationOptions,
} from "@tanstack/react-query";

export const checkUserAccountRegistration = async ({
	walletClient,
	publicClient,
}: { walletClient: WalletClient; publicClient: PublicClient }) => {
	invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");

	try {
		const isUserRegistered = await publicClient.readContract({
			address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
			abi: insuranceInstitutionAbi,
			functionName: "checkUserRegistration",
			args: [walletClient.account.address],
		});

		return isUserRegistered;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const useCheckUserAccountRegistration = ({
	walletClient,
	publicClient,
}: {
	walletClient?: WalletClient;
	publicClient?: PublicClient;
}) =>
	useQuery({
		queryKey: ["user", "account", "get"],
		queryFn: () =>
			checkUserAccountRegistration({
				walletClient: walletClient!,
				publicClient: publicClient!,
			}),
		enabled: !!walletClient && !!publicClient,
	});

export const useRegisterUserAccount = ({
	onSuccess,
}: { onSuccess: () => void }) =>
	useMutation({
		onSuccess,
		mutationFn: async ({ walletClient }: { walletClient: WalletClient }) => {
			invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");
			invariant(walletClient.chain, "ERR_WALLET_CLIENT_CHAIN");

			await walletClient.writeContract({
				address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				abi: insuranceInstitutionAbi,
				functionName: "registerNewUser",
				account: walletClient.account,
				chain: walletClient.chain,
			});
		},
	});
