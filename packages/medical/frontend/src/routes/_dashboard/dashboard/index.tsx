import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_dashboard/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate({
			to: "/dashboard/user",
		});
	}, [navigate]);

	return null;
}
