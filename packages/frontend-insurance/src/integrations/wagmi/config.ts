import { http, createConfig, injected } from "wagmi";
import { sepolia } from "wagmi/chains";

export const config = createConfig({
	chains: [sepolia],
	transports: {
		[sepolia.id]: http(),
	},
	connectors: [injected()],
});
