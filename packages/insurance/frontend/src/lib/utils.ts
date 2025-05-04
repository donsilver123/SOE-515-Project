import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import tinyInvariant from "tiny-invariant";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type InvariantType = "ERR_PUBLIC_CLIENT" | "ERR_WALLET_CLIENT" | "ERR_WALLET_CLIENT_ACCOUNT" | "ERR_WALLET_CLIENT_CHAIN";

export function invariant(
	condition: any,
	_type: InvariantType,
): asserts condition {
	return tinyInvariant(condition, _type);
}
