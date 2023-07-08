import { createSignal, type Component, type JSX, Accessor } from "solid-js";
import Input, { InputProps } from "../input";
import Icon from "../icon";
import {
	SelectOption,
	SelectWrapper,
	SelectedValue,
	SelectedValueWrapper,
	SpinnerWrapper,
} from "./styles";
import { Wrapper, Label } from "../input/styles";
import Spinner from "../spinner";

export type SearchProps = Omit<
	InputProps,
	"onInput" | "rightComponent" | "style" | "value"
> & {
	style?: JSX.CSSProperties;
	options?: any[];
	loading: boolean;
	value?: Accessor<string>;
	onSelect: (value: any) => void;
};

export const Search: Component<SearchProps> = (props) => {
	const { onSelect, style, loading = false, options } = props;

	let inputRef: HTMLInputElement;

	const [focused, setFocused] = createSignal<boolean>(false);
	const [searchString, setSearchString] = createSignal<string>("");

	const handleFocus = () => setFocused(true);
	const handleBlur = () => setFocused(false);
	const handleSelect = (selection: any) => {
		onSelect(selection);
		setSearchString(selection);
		inputRef.value = selection;
	};

	return (
		<div style={{ ...style, position: "relative" }}>
			<Input
				{...props}
				ref={inputRef}
				value={searchString()}
				onInput={(e: any) => setSearchString(e.target.value)}
				onFocus={handleFocus}
				onBlur={handleBlur}
				rightComponent={() => <Icon icon="search" size={20} />}
			/>
			{focused() && searchString() && (
				<SelectWrapper>
					{loading ? (
						<SpinnerWrapper>
							<Spinner size="30px" color="#BE7EE4" />
						</SpinnerWrapper>
					) : (
						<>
							<SelectOption onMouseDown={() => handleSelect("option A")}>
								Option A
							</SelectOption>
							<SelectOption onMouseDown={() => handleSelect("option B")}>
								Option B
							</SelectOption>
							<SelectOption onMouseDown={() => handleSelect("option C")}>
								Option C
							</SelectOption>
						</>
					)}
				</SelectWrapper>
			)}
		</div>
	);
};

export default Search;
