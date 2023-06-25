import { AsProps } from "solid-styled-components";
import { Wrapper } from "./styles";
import { children as createChildren, type Component, type JSX } from "solid-js";

export type CardProps = Component<
	JSX.HTMLAttributes<HTMLDivElement> & AsProps
> & {
	children: JSX.Element | JSX.Element[];
};

export const Card: Component<CardProps> = (props) => {
	const { children, ...rest } = props;
	const c = createChildren(() => props.children);

	return <Wrapper {...rest}>{c()}</Wrapper>;
};

export default Card;
