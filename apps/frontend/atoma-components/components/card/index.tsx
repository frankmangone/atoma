import React from "react";
import { Wrapper } from "./styles";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode | React.ReactNode[];
};

export const Card: React.FC<CardProps> = (props) => {
	const { children, ...rest } = props;

	return <Wrapper {...rest}>{children}</Wrapper>;
};

export default Card;
