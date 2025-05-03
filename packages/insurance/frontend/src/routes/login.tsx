import { Button } from "@/components/ui/button";
import { createFileRoute, invariant } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { injected, useAccount, useConnect, useWalletClient } from "wagmi";
import { createSiweMessage } from "viem/siwe";
import { env } from "@soe511/frontend-shared/env";
import { sepolia } from "viem/chains";
import type { Address, WalletClient } from "viem";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const { status: statusAccount, address } = useAccount();
	const { connect } = useConnect();
	const { data: walletClient, status: statusWalletClient } = useWalletClient();

	const signMessage = async ({
		address,
		walletClient,
	}: { address: Address; walletClient: WalletClient }) => {
		invariant(walletClient.account);

		const message = createSiweMessage({
			address,
			chainId: sepolia.id,
			domain: env.VITE_DOMAIN,
			nonce: Date.now().toString(),
			uri: `https://${env.VITE_DOMAIN}/auth`,
			version: "1",
		});

		const signature = await walletClient.signMessage({
			message,
			account: walletClient.account,
		});
		return signature;
	};

	return (
		<div>
			{statusAccount !== "connected" ? (
				<Button
					disabled={
						statusAccount === "reconnecting" || statusAccount === "connecting"
					}
					onClick={() => connect({ connector: injected() })}
				>
					{statusAccount === "connecting" ||
					statusAccount === "reconnecting" ? (
						<Loader2Icon className="size-4 animate-spin" />
					) : (
						"Connect Wallet"
					)}
				</Button>
			) : (
				statusWalletClient === "success" && (
					<Button onClick={() => signMessage({ address, walletClient })}>
						Sign message
					</Button>
				)
			)}
		</div>
	);
}
