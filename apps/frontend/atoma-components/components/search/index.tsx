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
import Spinner from "../spinner";
import { createDebounce } from "@solid-primitives/debounce";

export type SearchProps = Omit<
	InputProps,
	"onInput" | "rightComponent" | "style" | "value"
> & {
	style?: JSX.CSSProperties;
	options?: any[];
	loading?: boolean;
	value?: Accessor<string>;
	onSelect: (value: any) => void;
	onSearch: (searchString: string) => void | Promise<void>;
	debounceDelay?: number;
};

export const Search: Component<SearchProps> = (props) => {
	const {
		onSelect,
		onSearch,
		debounceDelay = 500,
		style,
		loading = false,
		options,
		...otherProps
	} = props;

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

	// Debounce search callback
	const search = createDebounce(
		(search: string) => onSearch(search),
		debounceDelay
	);

	const handleInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
		event
	) => {
		search(event.currentTarget.value);
		setSearchString(event.currentTarget.value);
	};

	return (
		<div style={{ ...style, position: "relative" }}>
			<Input
				{...otherProps}
				ref={inputRef}
				value={searchString()}
				onInput={handleInput}
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
