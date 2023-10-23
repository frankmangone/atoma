import React from "react";
import { HorizontalDivider, VerticalDivider } from "./styles";

const DIRECTIONS = {
	HORIZONTAL: "horizontal",
	VERTICAL: "vertical",
} as const;

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
	direction: (typeof DIRECTIONS)[keyof typeof DIRECTIONS];
};

export const Divider: React.FC<DividerProps> = (props) => {
	const { direction } = props;

	if (direction === DIRECTIONS.HORIZONTAL) {
		return <HorizontalDivider />;
	}

	return <VerticalDivider />;
};

export default Divider;
