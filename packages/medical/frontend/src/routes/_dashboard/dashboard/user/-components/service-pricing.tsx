import type { FunctionComponent } from "react";
import numeral from "numeral";
import { BN } from "bn.js";
import type { Service } from "@soe511/shared-frontend/types";
import { useGetServiceCost } from "./hooks";

export const ServicePricing: FunctionComponent<{
	service: Service;
}> = ({ service }) => {
	const { status, data } = useGetServiceCost(service);

	if (status === "pending") return "...";

	if (status === "error") return "Sorry an error ocurred";

	return <InternalServicePricing service={service} price={data} />;
};

const InternalServicePricing: FunctionComponent<{
	service: Service;
	price: bigint;
}> = ({ service, price }) => {
	const processedPrice = new BN(price.toString()).div(new BN(100));

	return (
		<div>
			<p>Service: {service}</p>
			<p>Price: {numeral(processedPrice.toString()).format("0,0.00")} PUSDC</p>
		</div>
	);
};
