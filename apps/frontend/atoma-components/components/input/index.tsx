import { AsProps } from "solid-styled-components";
import { Wrapper, Label, Input as InputBody, InputWrapper } from "./styles";
import { children, type Component, type JSX } from "solid-js";

export type InputProps = JSX.HTMLAttributes<HTMLDivElement> &
	JSX.InputHTMLAttributes<HTMLInputElement> &
	AsProps & {
		label: string;
		name: string;
		rightComponent?: JSX.Element;
		placeholder?: string;
	};

export const Input: Component<InputProps> = (props) => {
	const { value, onInput, label, name, placeholder, rightComponent, ...rest } =
		props;

	let renderedRightComponent = null;

	if (rightComponent) {
		renderedRightComponent = children(() => rightComponent);
	}

	return (
		<Wrapper {...rest}>
			<Label for={name}>{label}</Label>
			<InputWrapper>
				<InputBody
					value={value}
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
