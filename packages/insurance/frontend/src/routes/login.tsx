import { Button } from "@/components/ui/button";
import {
	useCheckUserAccountRegistration,
	useRegisterUserAccount,
} from "@/lib/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import {
	injected,
	useAccount,
	useConnect,
	usePublicClient,
	useWalletClient,
} from "wagmi";
import { invariant } from "@soe511/shared-frontend/utils";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const { status: accountStatus, address } = useAccount();
	const { connectAsync, status: connectStatus } = useConnect();
	const navigate = useNavigate();
	const { data: walletClient } = useWalletClient();
	const publicClient = usePublicClient();

	const isConnected = connectStatus === "success";

	const isConnecting =
		connectStatus === "pending" ||
		((accountStatus === "connecting" || accountStatus === "reconnecting") &&
			!address);

	const { data: isUserRegistered } = useCheckUserAccountRegistration({
		publicClient,
		walletClient,
	});

	const { mutate: registerUserAccount, status: registerUserAccountStatus } =
		useRegisterUserAccount({
			onSuccess: () => {
				navigate({
					to: "/dashboard",
				});
			},
		});

	const isRegistering = registerUserAccountStatus === "pending";

	const connectWallet = () => connectAsync({ connector: injected() });

	const registerUser = () => {
		invariant(publicClient, "ERR_PUBLIC_CLIENT");
		invariant(walletClient, "ERR_WALLET_CLIENT");
		invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");

		registerUserAccount({ publicClient, walletClient });
	};

	if (isUserRegistered)
		navigate({
			to: "/dashboard",
		});

	return (
		<div>
			{!isConnected && (
				<Button disabled={isConnecting} onClick={connectWallet}>
					{isConnecting ? (
						<Loader2Icon className="size-4 animate-spin" />
					) : (
						"Connect Wallet"
					)}
				</Button>
			)}
			{isConnected && (
				<Button disabled={isRegistering} onClick={registerUser}>
					{isRegistering ? (
						<Loader2Icon className="size-4 animate-spin" />
					) : (
						"Register"
					)}
				</Button>
			)}
		</div>
	);
}
