import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { env } from "@soe511/shared-frontend/env";
import { createFileRoute } from "@tanstack/react-router";
import { usePublicClient, useWalletClient } from "wagmi";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import { SelectItem } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { WalletClient } from "viem";
import { invariant } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	name: z.string(),
	coverageLimit: z.coerce.bigint(),
	coveredCondition: z.coerce.number().transform((v) => v.toString()),
});

export const Route = createFileRoute("/_dashboard/dashboard/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient();
	const { mutate, status: addingInsurancePlanStatus } = useMutation({
		mutationFn: async ({
			name,
			coverageLimit,
			coveredConditions,
			walletClient,
		}: {
			name: string;
			coverageLimit: bigint;
			coveredConditions: number[];
			walletClient: WalletClient;
		}) => {
			invariant(walletClient.account, "ERR_WALLET_CLIENT_ACCOUNT");
			invariant(walletClient.chain, "ERR_WALLET_CLIENT_CHAIN");

			await walletClient.writeContract({
				address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				abi: insuranceInstitutionAbi,
				functionName: "addInsurancePlan",
				args: [name, coverageLimit, coveredConditions],
				chain: walletClient.chain,
				account: walletClient.account,
			});
		},
	});

	const { data: coveredConditions, status } = useQuery({
		queryKey: ["covered-conditions", "list"],
		queryFn: async () => {
			invariant(publicClient, "ERR_PUBLIC_CLIENT");

			const conditions = await publicClient.readContract({
				address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
				abi: insuranceInstitutionAbi,
				functionName: "getCoveredConditions",
			});

			return conditions;
		},
		enabled: !!publicClient,
	});

	const form = useForm({
		defaultValues: {
			name: "",
			coverageLimit: 0n,
			coveredCondition: 0,
		},
		validators: {
			onChange: formSchema,
		},
		onSubmit: ({ value: { name, coverageLimit, coveredCondition } }) => {
			invariant(walletClient, "ERR_WALLET_CLIENT");

			mutate({
				name,
				coverageLimit,
				coveredConditions: [coveredCondition],
				walletClient,
			});
		},
	});

	if (status === "pending") return "Loading...";

	if (status === "error") return "Error occurred";

	return (
		<div>
			<form onSubmit={form.handleSubmit}>
				<form.Field name="name">
					{(field) => (
						<input
							defaultValue={field.state.value.toString()}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="Input plan name"
						/>
					)}
				</form.Field>
				<form.Field name="coverageLimit">
					{(field) => (
						<input
							defaultValue={field.state.value.toString()}
							onChange={(e) => field.handleChange(BigInt(e.target.value))}
							onBlur={field.handleBlur}
							placeholder="Input coverage limit ($)"
						/>
					)}
				</form.Field>
				<form.Field name="coveredCondition">
					{(field) => (
						<select
							defaultValue={field.state.value.toString()}
							onChange={(e) =>
								field.handleChange(Number.parseInt(e.target.value))
							}
						>
							{coveredConditions.map((condition, i) => (
								<option key={condition} value={i.toString()}>
									{condition}
								</option>
							))}
						</select>
					)}
				</form.Field>
				<Button type="submit" disabled={form.state.isSubmitting}>
					{form.state.isSubmitting ? (
						<Loader2Icon className="size-4 animate-spin" />
					) : (
						"Add"
					)}
				</Button>
			</form>
		</div>
	);
}
