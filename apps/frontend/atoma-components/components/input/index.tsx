import { AsProps } from "solid-styled-components";
import { Wrapper, Label, Input as InputBody } from "./styles";
import type { Component, JSX } from "solid-js";

export type InputProps = JSX.HTMLAttributes<HTMLDivElement> &
	AsProps & {
		label: string;
		name: string;
		placeholder?: string;
	};

export const Input: Component<InputProps> = (props) => {
	const { label, name, placeholder } = props;

	return (
		<Wrapper>
			<Label for={name}>{label}</Label>
			<InputBody type="text" name={name} placeholder={placeholder} />
		</Wrapper>
	);
};

export default Input;
