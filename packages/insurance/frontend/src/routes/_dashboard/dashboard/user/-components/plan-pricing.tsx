import type { Plan } from "@/lib/types";
import type { FunctionComponent } from "react";
import numeral from "numeral";

export const PlanPricing: FunctionComponent<{
	plan: Plan;
}> = ({ plan }) => {
	return <div>{numeral(plan.coverageLimit).format("0,0.00")} PUSDC</div>;
};
