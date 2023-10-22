import { AsProps } from "solid-styled-components";
import { HorizontalDivider, VerticalDivider } from "./styles";
import type { Component, JSX } from "solid-js";

const DIRECTIONS = {
	HORIZONTAL: "horizontal",
	VERTICAL: "vertical",
} as const;

export type DividerProps = JSX.HTMLAttributes<HTMLDivElement> &
	AsProps & {
		direction: (typeof DIRECTIONS)[keyof typeof DIRECTIONS];
	};

export const Divider: Component<DividerProps> = (props) => {
	const { direction } = props;

	if (direction === DIRECTIONS.HORIZONTAL) {
		return <HorizontalDivider />;
	}

	return <VerticalDivider />;
};

export default Divider;
