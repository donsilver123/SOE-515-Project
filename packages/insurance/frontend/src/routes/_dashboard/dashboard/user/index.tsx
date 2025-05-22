import { env } from "@soe511/shared-frontend/env";
import { createFileRoute } from "@tanstack/react-router";
import { usePublicClient, useReadContract, useWalletClient } from "wagmi";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, useStore } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { PlanPricing } from "./-components/plan-pricing";
import { purchasePlan } from "./-components/actions";
import type { FunctionComponent } from "react";
import type { PublicClient, WalletClient } from "viem";
import type { Plan } from "@/lib/types";
import { toast } from "sonner";

const formSchema = z.object({
	planId: z.number(),
});

export const Route = createFileRoute("/_dashboard/dashboard/user/")({
	component: UserDashboardPage,
});

const UserDashboardForm: FunctionComponent<{
	plans: readonly Plan[];
	walletClient: WalletClient;
	publicClient: PublicClient;
}> = ({ plans, walletClient, publicClient }) => {
	const form = useForm({
		defaultValues: {
			planId: 0,
		},
		validators: {
			onChange: formSchema,
		},
		onSubmit: async ({ value: { planId } }) => {
			const res = await purchasePlan({
				plan: plans[planId],
				publicClient,
				walletClient,
			});

			if (res.isErr) {
				toast.warning(res.error);
				return;
			}

			toast.success("Insurance plan successfully purchased!");
		},
	});

	const { planId } = useStore(form.store, (state) => state.values);

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div>
					<form.Field name="planId">
						{(field) => (
							<select
								onChange={(e) =>
									field.setValue(Number.parseInt(e.target.value))
								}
								defaultValue={field.state.value.toString()}
							>
								{plans.map((plan) => (
									<option key={plan.id} value={plan.id.toString()}>
										{plan.name}
									</option>
								))}
							</select>
						)}
					</form.Field>
				</div>
				{plans && <PlanPricing plan={plans[planId]} />}
				<div>
					<Button type="submit" disabled={form.state.isSubmitting}>
						{form.state.isSubmitting ? (
							<Loader2Icon className="size-4 animate-spin" />
						) : (
							"Purchase"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

function UserDashboardPage() {
	const { data: walletClient, status: statusWalletClient } = useWalletClient();
	const publicClient = usePublicClient();
	const { data: plans, status: plansStatus } = useReadContract({
		address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
		abi: insuranceInstitutionAbi,
		functionName: "getPlans",
	});

	if (
		statusWalletClient !== "success" ||
		!publicClient ||
		plansStatus !== "success"
	)
		return "Loading...";

	return (
		<UserDashboardForm
			publicClient={publicClient}
			walletClient={walletClient}
			plans={plans}
		/>
	);
}
