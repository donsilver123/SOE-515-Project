import { env } from "@soe511/shared-frontend/env";
import { createFileRoute } from "@tanstack/react-router";
import { usePublicClient, useReadContract, useWalletClient } from "wagmi";
import { medicalInstitutionAbi } from "@soe511/shared-frontend/abi";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, useStore } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { processVisit } from "./-components/actions";
import type { FunctionComponent } from "react";
import type { PublicClient, WalletClient } from "viem";
import { toast } from "sonner";
import type { Service } from "@soe511/shared-frontend/types";
import { ServicePricing } from "./-components/service-pricing";

const formSchema = z.object({
	serviceId: z.number(),
});

export const Route = createFileRoute("/_dashboard/dashboard/user/")({
	component: UserDashboardPage,
});

const UserDashboardForm: FunctionComponent<{
	services: readonly Service[];
	walletClient: WalletClient;
	publicClient: PublicClient;
}> = ({ services, walletClient, publicClient }) => {
	const form = useForm({
		defaultValues: {
			serviceId: 0,
		},
		validators: {
			onChange: formSchema,
		},
		onSubmit: async ({ value: { serviceId } }) => {
			const res = await purchasePlan({
				service: services[serviceId],
				publicClient,
				walletClient,
			});

			if (res.isErr) {
				toast.warning("Sorry an error occurred!");
				return;
			}

			toast.success("Visit successful");
		},
	});

	const { serviceId } = useStore(form.store, (state) => state.values);

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div>
					<form.Field name="serviceId">
						{(field) => (
							<select
								onChange={(e) =>
									field.setValue(Number.parseInt(e.target.value))
								}
								defaultValue={field.state.value.toString()}
							>
								{services.map((service) => (
									<option key={service} value={service}>
										{service}
									</option>
								))}
							</select>
						)}
					</form.Field>
				</div>
				{services && <ServicePricing service={services[serviceId]} />}
				<div>
					<Button type="submit" disabled={form.state.isSubmitting}>
						{form.state.isSubmitting ? (
							<Loader2Icon className="size-4 animate-spin" />
						) : (
							"Conclude"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

const useGetServices = () => {
	const res = useReadContract({
		address: env.VITE_MEDICAL_INSTITUTION_CONTRACT_ADDRESS,
		abi: medicalInstitutionAbi,
		functionName: "getServices",
	});

	if (res.status === "success") return { ...res, data: res.data as Service[] };

	return res;
};

function UserDashboardPage() {
	const { data: walletClient, status: statusWalletClient } = useWalletClient();
	const publicClient = usePublicClient();
	const { data: services, status: servicesStatus } = useGetServices();

	if (
		statusWalletClient !== "success" ||
		!publicClient ||
		servicesStatus !== "success"
	)
		return "Loading...";

	return (
		<UserDashboardForm
			publicClient={publicClient}
			walletClient={walletClient}
			services={services}
		/>
	);
}
