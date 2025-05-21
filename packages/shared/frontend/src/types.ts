import type {
  insuranceInstitutionAbi,
  medicalInstitutionAbi,
} from "@soe511/shared-frontend/abi";
import type {
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
} from "abitype";

export type Plan = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof insuranceInstitutionAbi, "getPlanById">["outputs"]
>[number];

export const services = [
  "REGULAR_CHECKUP",
  "CONSULTATION",
  "INFECTIOUS_DISEASES",
  "RESPIRATORY_ILLNESS",
  "CARDIOVASCULAR_DISEASES",
  "GASTROINTESTINAL_DISORDERS",
  "MUSCULOSKELETAL_CONDITIONS",
  "MENTAL_HEALTH_SERVICES",
  "MATERNITY_CARE",
  "PEDIATRIC_CARE",
  "EMERGENCY_CARE",
  "SURGICAL_PROCEDURES",
  "DIAGNOSTIC_TESTS",
  "PRESCRIPTION_DRUGS",
  "CANCER_TREATMENT",
  "DIABETES_MANAGEMENT",
  "ALLERGIES_AND_IMMUNOLOGY",
  "REHABILITATION_SERVICES",
  "VISION_CARE",
  "DENTAL_CARE",
  "OTHER",
] as const;

export type Service = (typeof services)[number];
