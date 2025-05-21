import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: IndexPage,
	loader: () => {
		throw redirect({
			to: "/login",
		});
	},
});

function IndexPage() {
	return null;
}
