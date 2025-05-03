import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { isAddress, getAddress } from "viem";

export const addressSchema = z
	.string()
	.refine((addr) => !!isAddress(addr), { message: "not a valid address" })
	.transform((addr) => getAddress(addr));

export const portSchema = z.coerce.number().min(0).max(65535);

export const env = createEnv({
	server: {
		INSURANCE_INSTITUTION_CONTRACT_ADDRESS: addressSchema,
		INSURANCE_INSTITUTION_API_URL: z.string().url(),
		INSURANCE_INSTITUTION_SERVER_PORT: portSchema,
		DOMAIN: z.string(),
		JWT_SECRET: z.string().min(32),
	},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "VITE_",

	client: {},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	runtimeEnv: process.env,

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});
