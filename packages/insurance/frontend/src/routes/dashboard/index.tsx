import { createFileRoute, redirect } from "@tanstack/react-router";
import { usePublicClient, useWalletClient } from "wagmi";
import { erc721Abi } from "viem";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { env } from "@soe511/shared-frontend/env";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const { data, status } = useQuery({
    queryKey: ["staff-nft", "get"],
    queryFn: async () => {
      invariant(publicClient);
      invariant(walletClient);
      invariant(walletClient.account);

      const res = await publicClient.readContract({
        address: env.VITE_INSURANCE_INSTITUTION_NFT_CONTRACT_ADDRESS,
        abi: erc721Abi,
        functionName: "balanceOf",
        args: [walletClient.account.address],
      });

      return res > 0;
    },
  });

  if (status === "success") {
    if (data === true)
      throw redirect({
        to: "/dashboard/admin",
      });
    throw redirect({
      to: "/dashboard/user",
    });
  }

  return null;
}
