import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import { env } from "@soe511/shared-frontend/env";
import type { WalletClient } from "viem";

export const purchasePlan = async ({
	planId,
	walletClient,
}: { planId: number; walletClient: WalletClient }) => {
  await walletClient.writeContract({
    address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
    abi: insuranceInstitutionAbi,
    functionName: "",
    args: []
  })
};
