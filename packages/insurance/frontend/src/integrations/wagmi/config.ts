import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { anvil } from "wagmi/chains";

export const config = createConfig({
	chains: [anvil],
	transports: {
		[anvil.id]: http(),
	},
	connectors: [injected()],
});
