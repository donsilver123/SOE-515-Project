import { env } from "@soe511/shared-frontend/env";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import type { PublicClient, WalletClient } from "viem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { invariant } from "@soe511/shared-frontend/utils";

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
		console.warn(err);
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
				// biome-ignore lint/style/noNonNullAssertion: the `enabled` field ensures that this query fn only gets executed when the value is not falsy
				walletClient: walletClient!,
				// biome-ignore lint/style/noNonNullAssertion: the `enabled` field ensures that this query fn only gets executed when the value is not falsy
				publicClient: publicClient!,
			}),
		enabled: !!walletClient && !!publicClient,
	});

export const useRegisterUserAccount = ({
	onSuccess,
}: { onSuccess: () => void }) =>
	useMutation({
		onSuccess,
		mutationFn: async ({
			walletClient,
			publicClient,
		}: { walletClient: WalletClient; publicClient: PublicClient }) => {
			invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");
			invariant(walletClient.chain, "ERR_WALLET_CLIENT_CHAIN");

			const { request } = await publicClient.simulateContract({
				address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				abi: insuranceInstitutionAbi,
				functionName: "registerNewUser",
				account: walletClient.account,
				chain: walletClient.chain,
			});

			await walletClient.writeContract(request);
		},
	});
