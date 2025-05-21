import type { FunctionComponent } from "react";
import numeral from "numeral";
import { BN } from "bn.js";
import type { Plan } from "@soe511/shared-frontend/types";

export const PlanPricing: FunctionComponent<{
	plan: Plan;
}> = ({ plan }) => {
	const processedPrice = new BN(plan.price.toString()).div(new BN(100));
	const processedCoverageLimit = new BN(plan.coverageLimit.toString()).div(
		new BN(100),
	);

	return (
		<div>
			<p>Price: {numeral(processedPrice.toString()).format("0,0.00")} PUSDC</p>
			<p>
				Coverage limit:{" "}
				{numeral(processedCoverageLimit.toString()).format("0,0.00")} PUSDC
			</p>
		</div>
	);
};
