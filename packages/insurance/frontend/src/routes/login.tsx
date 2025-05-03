import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { injected, useAccount, useConnect } from "wagmi";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const { status: accountStatus, address } = useAccount();
	const { connect, status: connectStatus } = useConnect();
	const navigate = useNavigate();

	const isConnecting =
		connectStatus === "pending" ||
		accountStatus === "connecting" ||
		accountStatus === "reconnecting";

	console.log("connectStatus:", connectStatus);
	console.log("accountStatus:", accountStatus, address);
	console.log("isConnecting:", isConnecting);

	const isConnected = accountStatus === "connected";

	if (isConnected)
		navigate({
			to: "/dashboard",
		});

	return (
		<div>
			<Button
				disabled={isConnecting}
				onClick={() => connect({ connector: injected() })}
			>
				{isConnecting ? (
					<Loader2Icon className="size-4 animate-spin" />
				) : (
					"Connect Wallet"
				)}
			</Button>
		</div>
	);
}
