import { env } from "@soe511/shared-frontend/env";
import { createFileRoute } from "@tanstack/react-router";
import { useReadContract } from "wagmi";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, useStore } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { PlanPricing } from "./-components/plan-pricing";
import { purchasePlan } from "./-components/actions";

const formSchema = z.object({
	planId: z.number(),
});

export const Route = createFileRoute("/_dashboard/dashboard/user/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: plans, status } = useReadContract({
		address: env.VITE_INSURANCE_INSTITUTION_CONTRACT_ADDRESS,
		abi: insuranceInstitutionAbi,
		functionName: "getPlans",
	});

	const form = useForm({
		defaultValues: {
			planId: 0,
		},
		validators: {
			onChange: formSchema,
		},
		onSubmit: ({ value: { planId } }) => purchasePlan(planId),
	});

	const { planId } = useStore(form.store, (state) => state.values);

	if (status === "pending") return "Loading...";

	if (status === "error") return "Error occurred";

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
}
