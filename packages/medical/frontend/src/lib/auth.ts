import { env } from "@soe511/shared-frontend/env";
import { medicalInstitutionAbi } from "@soe511/shared-frontend/abi";
import type { PublicClient, WalletClient } from "viem";
import { invariant } from "@soe511/shared-frontend/utils";
import { useMutation, useQuery } from "@tanstack/react-query";

export const checkUserAccountRegistration = async ({
  walletClient,
  publicClient,
}: { walletClient: WalletClient; publicClient: PublicClient }) => {
  invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");

  try {
    const isUserRegistered = await publicClient.readContract({
      address: env.VITE_MEDICAL_INSTITUTION_CONTRACT_ADDRESS,
      abi: medicalInstitutionAbi,
      functionName: "isUserRegistered",
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
        address: env.VITE_MEDICAL_INSTITUTION_CONTRACT_ADDRESS,
        abi: medicalInstitutionAbi,
        functionName: "registerUser",
        args: [walletClient.account.address],
        account: walletClient.account,
        chain: walletClient.chain,
      });

      await walletClient.writeContract(request);
    },
  });
