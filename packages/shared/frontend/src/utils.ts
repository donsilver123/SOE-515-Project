import tinyInvariant from "tiny-invariant";
import { services, type Service } from "./types";

type InvariantType =
  | "ERR_PUBLIC_CLIENT"
  | "ERR_WALLET_CLIENT"
  | "ERR_WALLET_CLIENT_ACCOUNT"
  | "ERR_WALLET_CLIENT_CHAIN";

export function invariant(
  condition: any,
  _type: InvariantType,
): asserts condition {
  return tinyInvariant(condition, _type);
}

export const serviceToEnum = (service: Service) => services.indexOf(service);
