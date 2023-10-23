import React from "react";
import { Button as StyledButton } from "./styles";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = (props) => {
	return <StyledButton {...props} />;
};

export default Button;
