import type { insuranceInstitutionAbi } from "@soe511/shared-frontend/abi";
import type {
	AbiParametersToPrimitiveTypes,
	ExtractAbiFunction,
} from "abitype";

export type Plan = AbiParametersToPrimitiveTypes<
	ExtractAbiFunction<typeof insuranceInstitutionAbi, "getPlanById">["outputs"]
>[number];
