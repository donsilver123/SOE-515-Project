import {
	insuranceInstitutionAbi,
	medicalInstitutionAbi,
} from "@soe511/shared-frontend/abi";
import { env } from "@soe511/shared-frontend/env";
import {
	encodePacked,
	erc20Abi,
	keccak256,
	type PublicClient,
	type WalletClient,
} from "viem";
import { Result, type Unit } from "true-myth";
import type { Service } from "@soe511/shared-frontend/types";
import { invariant, serviceToEnum } from "@soe511/shared-frontend/utils";

const MEDICAL_INSTITUTION_ID = 0;

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
		const nonce = await publicClient.readContract({
			address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
			abi: insuranceInstitutionAbi,
			functionName: "getUserNonceForMedicalInstitutionAuthorization",
			args: [BigInt(MEDICAL_INSTITUTION_ID)],
		});

		const hash = keccak256(encodePacked(["uint256"], [nonce]));

		const signature = await walletClient.signMessage({
			message: { raw: hash },
			account: walletClient.account,
		});

		const { request } = await publicClient.simulateContract({
			address: env.VITE_MEDICAL_INSTITUTION_CONTRACT_ADDRESS,
			abi: medicalInstitutionAbi,
			functionName: "processVisit",
			args: [
				walletClient.account.address,
				serviceToEnum(service),
				nonce,
				signature,
			],
			account: walletClient.account,
			chain: walletClient.chain,
		});

		await walletClient.writeContract(request);

		return Result.ok();
	} catch (err) {
		console.warn(err);
		return Result.err();
	}
};
