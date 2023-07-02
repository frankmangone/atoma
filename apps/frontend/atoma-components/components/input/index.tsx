import { AsProps } from "solid-styled-components";
import { Wrapper, Label, Input as InputBody, InputWrapper } from "./styles";
import { Accessor, children, type Component, type JSX } from "solid-js";

export type InputProps = JSX.HTMLAttributes<HTMLInputElement> &
	JSX.InputHTMLAttributes<HTMLInputElement> &
	AsProps & {
		label: string;
		name: string;
		rightComponent?: Accessor<JSX.Element>;
		placeholder?: string;
	};

export const Input: Component<InputProps> = (props) => {
	const {
		value,
		onFocus,
		onBlur,
		onInput,
		label,
		name,
		placeholder,
		rightComponent,
		...rest
	} = props;

	let renderedRightComponent = null;

	if (rightComponent) {
		renderedRightComponent = children(() => rightComponent());
	}

	return (
		<Wrapper {...rest}>
			<Label for={name}>{label}</Label>
			<InputWrapper>
				<InputBody
					value={value}
					onFocus={onFocus}
					onBlur={onBlur}
					onInput={onInput}
					type="text"
					name={name}
					placeholder={placeholder}
				/>
				{renderedRightComponent}
			</InputWrapper>
		</Wrapper>
	);
};

export default Input;
