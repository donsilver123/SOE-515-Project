import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { injected, useAccount, useConnect } from "wagmi";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const { status: statusAccount } = useAccount();
	const { connect } = useConnect();

	if (statusAccount === "connected")
		throw redirect({
			to: "/dashboard",
		});

	return (
		<div>
			<Button
				disabled={
					statusAccount === "reconnecting" || statusAccount === "connecting"
				}
				onClick={() => connect({ connector: injected() })}
			>
				{statusAccount === "connecting" || statusAccount === "reconnecting" ? (
					<Loader2Icon className="size-4 animate-spin" />
				) : (
					"Connect Wallet"
				)}
			</Button>
		</div>
	);
}
