import { AsProps } from "solid-styled-components";
import { Button as StyledButton } from "./styles";
import type { Component, JSX } from "solid-js";

export type ButtonProps = JSX.HTMLAttributes<HTMLButtonElement> &
	AsProps & { disabled?: boolean };

export const Button: Component<ButtonProps> = (props) => {
	return <StyledButton {...props} />;
};

export default Button;
