import { Button } from "@/components/ui/button";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import { env } from "@soe511/shared-frontend/env";
import {
	createFileRoute,
	invariant,
	useNavigate,
} from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { injected, useAccount, useConnect, useWalletClient } from "wagmi";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const { status: accountStatus, address } = useAccount();
	const { connectAsync, status: connectStatus } = useConnect();
	const navigate = useNavigate();
	const { data: walletClient } = useWalletClient();

	const isConnecting =
		connectStatus === "pending" ||
		accountStatus === "connecting" ||
		accountStatus === "reconnecting";

	console.log("connectStatus:", connectStatus);
	console.log("accountStatus:", accountStatus, address);
	console.log("isConnecting:", isConnecting);

	const isConnected = accountStatus === "connected";

	const connectWallet = async () => {
		await connectAsync({ connector: injected() });
		invariant(walletClient);
		invariant(walletClient.account);

		await walletClient.writeContract({
			address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
			abi: insuranceInstitutionAbi,
			functionName: "registerNewUser",
		});

		navigate({
			to: "/dashboard",
		});
	};

	if (isConnected)
		navigate({
			to: "/dashboard",
		});

	return (
		<div>
			<Button disabled={isConnecting} onClick={connectWallet}>
				{isConnecting ? (
					<Loader2Icon className="size-4 animate-spin" />
				) : (
					"Connect Wallet"
				)}
			</Button>
		</div>
	);
}
