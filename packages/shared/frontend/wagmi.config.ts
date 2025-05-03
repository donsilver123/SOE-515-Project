import { defineConfig } from "@wagmi/cli";
import { type Abi } from "viem";
import InsuranceInstitution from "@soe511/insurance-contract/InsuranceInstitution.sol/InsuranceInstitution.json" with {
  type: "json",
};

export default defineConfig({
  out: "./src/abi.ts",
  contracts: [
    { name: "InsuranceInstitution", abi: InsuranceInstitution.abi as Abi },
  ],
  plugins: [],
});
