import { env } from "@soe511/shared-frontend/env";
import { createFileRoute } from "@tanstack/react-router";
import { useReadContract } from "wagmi";
import { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";

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
		onSubmit: () => { },
	});

	console.log(plans);

	if (status === "pending") return "Loading...";

	if (status === "error") return "Error occurred";

	return (
		<div>
			<form onSubmit={form.handleSubmit}>
				<form.Field name="planId">
					{(field) => (
						<select
							onChange={(e) => field.setValue(Number.parseInt(e.target.value))}
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
				<Button type="submit" disabled={form.state.isSubmitting}>
					{form.state.isSubmitting ? (
						<Loader2Icon className="size-4 animate-spin" />
					) : (
						"Purchase"
					)}
				</Button>
			</form>
		</div>
	);
}
