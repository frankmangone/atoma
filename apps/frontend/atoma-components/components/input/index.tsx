import { AsProps } from "solid-styled-components";
import { Wrapper, Label, Input as InputBody } from "./styles";
import type { Component, JSX } from "solid-js";

export type InputProps = JSX.HTMLAttributes<HTMLDivElement> &
	JSX.InputHTMLAttributes<HTMLInputElement> &
	AsProps & {
		label: string;
		name: string;
		placeholder?: string;
	};

export const Input: Component<InputProps> = (props) => {
	const { value, onInput, label, name, placeholder, ...rest } = props;

	return (
		<Wrapper {...rest}>
			<Label for={name}>{label}</Label>
			<InputBody
				value={value}
				onInput={onInput}
				type="text"
				name={name}
				placeholder={placeholder}
			/>
		</Wrapper>
	);
};

export default Input;
