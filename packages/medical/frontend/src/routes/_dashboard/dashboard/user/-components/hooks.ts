import { medicalInstitutionAbi } from "@soe511/shared-frontend/abi";
import { env } from "@soe511/shared-frontend/env";
import type { Service } from "@soe511/shared-frontend/types";
import { serviceToEnum } from "@soe511/shared-frontend/utils";
import { useReadContract } from "wagmi";

export const useGetServiceCost = (service: Service) =>
  useReadContract({
    address: env.VITE_MEDICAL_INSTITUTION_CONTRACT_ADDRESS,
    functionName: "getServiceCost",
    abi: medicalInstitutionAbi,
    args: [serviceToEnum(service)],
  });
