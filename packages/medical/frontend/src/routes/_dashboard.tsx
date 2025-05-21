import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
	useAccount,
	useConnect,
	usePublicClient,
	useWalletClient,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { accountStore } from "@/components/account";
import { useEffect } from "react";
import { invariant } from "@soe511/shared-frontend/utils";
import { checkUserAccountRegistration } from "@/lib/auth";

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const { status: accountStatus } = useAccount();
	const { status: connectStatus } = useConnect();
	const publicClient = usePublicClient();
	const { data: walletClient, status: walletClientStatus } = useWalletClient();
	const navigate = useNavigate();

	const isDisconnected = accountStatus === "disconnected";

	const { data: queryData, status: queryStatus } = useQuery({
		queryKey: ["user", "account", "get"],
		queryFn: async () => {
			invariant(publicClient, "ERR_PUBLIC_CLIENT");
			invariant(walletClient, "ERR_PUBLIC_CLIENT");
			invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");

			const isRegistered = await checkUserAccountRegistration({
				publicClient,
				walletClient,
			});

			return isRegistered;
		},
		enabled: !!publicClient && !!walletClient,
	});

	const shouldRedirectToLogin =
		isDisconnected || (queryStatus !== "pending" && queryData !== true);

	useEffect(() => {
		if (walletClient)
			accountStore.setState((state) => ({
				...state,
				walletClient,
			}));
	}, [walletClient]);

	useEffect(() => {
		if (publicClient)
			accountStore.setState((state) => ({
				...state,
				publicClient,
			}));
	}, [publicClient]);

	useEffect(() => {
		if (shouldRedirectToLogin) {
			navigate({
				to: "/login",
			});
		}
	}, [navigate, shouldRedirectToLogin]);

	return <Outlet />;
}
