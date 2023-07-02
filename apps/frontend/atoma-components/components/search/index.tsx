import { createSignal, type Component, type JSX, Accessor } from "solid-js";
import Input, { InputProps } from "../input";
import Icon from "../icon";
import { SelectOption, SelectWrapper } from "./styles";

export type SearchProps = Omit<
	InputProps,
	"onInput" | "rightComponent" | "style" | "value"
> & {
	value?: Accessor<string>;
	style?: JSX.CSSProperties;
	options?: any[];
	onSelect: (value: any) => void;
};

export const Search: Component<SearchProps> = (props) => {
	const { onSelect, style, options } = props;

	const [focused, setFocused] = createSignal<boolean>(false);
	const [searchString, setSearchString] = createSignal<string>("");

	const handleFocus = () => setFocused(true);
	const handleBlur = () => setFocused(false);
	const handleSelect = (selection: any) => onSelect(selection);

	const icon = () =>
		props.value() ? (
			<button onClick={() => onSelect(undefined)}>
				<Icon icon="times" size={20} />
			</button>
		) : (
			<Icon icon="search" size={20} />
		);

	return (
		<div style={{ ...style, position: "relative" }}>
			<Input
				{...props}
				value={searchString()}
				onInput={setSearchString}
				onFocus={handleFocus}
				onBlur={handleBlur}
				rightComponent={icon}
			/>
			{focused() && searchString() && (
				<SelectWrapper>
					<SelectOption onMouseDown={() => handleSelect("option A")}>
						Option A
					</SelectOption>
					<SelectOption onMouseDown={() => handleSelect("option B")}>
						Option B
					</SelectOption>
					<SelectOption onMouseDown={() => handleSelect("option C")}>
						Option C
					</SelectOption>
				</SelectWrapper>
			)}
		</div>
	);
};

export default Search;
