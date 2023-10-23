import React from "react";
import { Wrapper, Label, Input as InputBody, InputWrapper } from "./styles";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	ref: any;
	label: string;
	name: string;
	placeholder?: string;
	rightComponent?: React.ReactNode;
};

export const Input: React.FC<InputProps> = (props) => {
	const {
		ref,
		value,
		onFocus,
		onBlur,
		onInput,
		label,
		name,
		placeholder,
		rightComponent = null,
		...rest
	} = props;

	return (
		<Wrapper {...rest}>
			<Label htmlFor={name}>{label}</Label>
			<InputWrapper>
				<InputBody
					ref={ref}
					value={value}
					onFocus={onFocus}
					onBlur={onBlur}
					onInput={onInput}
					type="text"
					name={name}
					placeholder={placeholder}
				/>
				{rightComponent}
			</InputWrapper>
		</Wrapper>
	);
};

export default Input;
