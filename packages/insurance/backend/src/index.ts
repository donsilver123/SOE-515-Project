import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "@soe511/shared-backend/env";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createSiweMessage } from "viem/siwe";
import { sepolia } from "viem/chains";
import { publicClient } from "./lib/web3";
import type { Hex } from "viem";
import { SignJWT } from "jose";
import { Address } from "abitype/zod";

const jwtSecret = new TextEncoder().encode(env.JWT_SECRET);

const app = new Hono().post(
  "/auth/sign-in",
  zValidator(
    "json",
    z.object({
      signature: z
        .string()
        .startsWith("0x")
        .transform((s) => s as Hex),
      address: Address,
    }),
  ),
  async (c) => {
    const json = c.req.valid("json");

    const message = createSiweMessage({
      address: json.address,
      chainId: sepolia.id,
      domain: env.DOMAIN,
      nonce: Date.now().toString(),
      uri: `https://${env.DOMAIN}/auth`,
      version: "1",
    });

    const result = await publicClient.verifySiweMessage({
      message,
      signature: json.signature,
    });

    if (!result) return c.json({ code: "SIGNIN_FAILED" }, 400);

    return c.json({
      code: "SIGNIN_SUCCESSFUL",
      access_token: await new SignJWT({ address: json.address })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer(env.DOMAIN)
        .setAudience(env.DOMAIN)
        .setExpirationTime("1d")
        .sign(jwtSecret),
    });
  },
);

export type App = typeof app;

serve(
  {
    fetch: app.fetch,
    port: env.INSURANCE_INSTITUTION_SERVER_PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
