import {
	createFileRoute,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import {
	useAccount,
	useConnect,
	usePublicClient,
	useWalletClient,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { env } from "@soe511/shared-frontend/env";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const { status: accountStatus } = useAccount();
	const { status: connectStatus } = useConnect();
	const publicClient = usePublicClient();
	const { data: walletClient, status: walletClientStatus } = useWalletClient();
	const navigate = useNavigate();

	const isDisconnected =
		accountStatus === "disconnected" ||
		(accountStatus !== "connected" &&
			(connectStatus === "idle" || connectStatus === "error"));

	console.log(accountStatus);
	console.log(connectStatus);
	console.log(isDisconnected);
	console.log(null);

	const { data: queryData, status: queryStatus } = useQuery({
		queryKey: ["user", "account", "get"],
		queryFn: async () => {
			invariant(publicClient);
			invariant(walletClient);
			invariant(walletClient.account);

			const userId = await publicClient.readContract({
				address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				abi: insuranceInstitutionAbi,
				functionName: "addressToUserId",
				args: [walletClient.account.address],
			});

			const user = await publicClient.readContract({
				address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				abi: insuranceInstitutionAbi,
				functionName: "getUserById",
				args: [userId],
			});

			return user.isRegistered;
		},
		enabled: accountStatus === "connected",
	});

	const shouldRedirectToLogin =
		isDisconnected || (queryStatus === "success" && queryData !== true);

	if (shouldRedirectToLogin)
		navigate({
			to: "/login",
		});

	return <Outlet />;
}
