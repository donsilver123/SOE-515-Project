import type { ReactNode, FunctionComponent } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config";

const queryClient = new QueryClient();

export const Provider: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
};
