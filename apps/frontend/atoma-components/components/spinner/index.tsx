import React from "react";
import { Wrapper } from "./styles";

export type SpinnerProps = {
	size: string;
	color?: string;
};

export const Spinner: React.FC<SpinnerProps> = (props) => {
	return (
		<Wrapper size={props.size}>
			<svg viewBox="0 0 30 30">
				<path
					d="M15 2.5 a 12.5 12.5 0 0 1 0 25 a 12.5 12.5 0 0 1 0 -25"
					style={{ stroke: props.color ?? "white" }}
				/>
			</svg>
		</Wrapper>
	);
};

export default Spinner;
