import { createSignal, type Component, type JSX } from "solid-js";
import Input, { InputProps } from "../input";
import Icon from "../icon";
import { SelectOption, SelectWrapper } from "./styles";

export type SearchProps = Omit<InputProps, "rightComponent" | "style"> & {
	style?: JSX.CSSProperties;
	options?: any[];
};

export const Search: Component<SearchProps> = (props) => {
	const { style, options } = props;
	const [focused, setFocused] = createSignal<boolean>(false);

	const handleFocus = () => setFocused(true);
	const handleBlur = () => setFocused(false);

	return (
		<div style={{ ...style, position: "relative" }}>
			<Input
				onFocus={handleFocus}
				onBlur={handleBlur}
				rightComponent={<Icon icon="search" size={20} />}
				{...props}
			/>
			{focused() && props.value && (
				<SelectWrapper>
					<SelectOption>Option A</SelectOption>
					<SelectOption>Option B</SelectOption>
					<SelectOption>Option C</SelectOption>
				</SelectWrapper>
			)}
		</div>
	);
};

export default Search;
