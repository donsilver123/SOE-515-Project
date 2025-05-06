import { Button } from "@/components/ui/button";
import {
	useCheckUserAccountRegistration,
	useRegisterUserAccount,
} from "@/lib/auth";
import {
	createFileRoute,
	invariant,
	useNavigate,
} from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import {
	injected,
	useAccount,
	useConnect,
	usePublicClient,
	useReadContract,
	useWalletClient,
} from "wagmi";

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
		invariant(walletClient);
		invariant(walletClient.account);

		registerUserAccount({ walletClient });
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
