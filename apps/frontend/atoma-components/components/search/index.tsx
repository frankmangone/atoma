import React, { useState } from "react";
import Input, { InputProps } from "../input";
import Icon from "../icon";
import { SelectOption, SelectWrapper, SpinnerWrapper } from "./styles";
import Spinner from "../spinner";

export type SearchProps = Omit<
	InputProps,
	"onInput" | "rightComponent" | "style" | "value"
> & {
	style?: Record<string, unknown>;
	options?: Array<{ display: any; value: string }>;
	loading?: boolean;
	value?: string;
	onSelect: (value: any) => void;
	onSearch: (searchString: string) => void | Promise<void>;
	debounceDelay?: number;
};

export const Search: React.FC<SearchProps> = (props) => {
	const {
		onSelect,
		onSearch,
		debounceDelay = 500,
		style,
		options = [],
		...otherProps
	} = props;

	let inputRef: HTMLInputElement;

	const [focused, setFocused] = useState<boolean>(false);
	const [typing, setTyping] = useState<boolean>(false);
	const [searchString, setSearchString] = useState<string>("");

	const handleFocus = () => setFocused(true);
	const handleBlur = () => setFocused(false);
	const handleSelect = (selection: { display: string; value: string }) => {
		onSelect(selection.value);
		setSearchString(selection.display);
		inputRef.value = selection.display;
	};

	// Debounce search callback
	// const search = createDebounce((search: string) => {
	// 	onSearch(search);
	// 	setTyping(false);
	// }, debounceDelay);

	const handleInput = (event: unknown) => {
		// setTyping(true);
		// search(event.currentTarget.value);
		// setSearchString(event.currentTarget.value);
	};

	return (
		<div style={{ ...style, position: "relative" }}>
			<Input
				{...otherProps}
				ref={inputRef}
				value={searchString}
				onChange={handleInput}
				onFocus={handleFocus}
				onBlur={handleBlur}
				rightComponent={<Icon icon="search" size={20} />}
			/>
			{focused && searchString && (
				<SelectWrapper>
					{typing || props.loading ? (
						<SpinnerWrapper>
							<Spinner size="30px" color="#BE7EE4" />
						</SpinnerWrapper>
					) : (
						options.map((item) => (
							<SelectOption
								onMouseDown={() =>
									handleSelect({ display: item.display, value: item.value })
								}
							>
								{item.display}
							</SelectOption>
						))
					)}
				</SelectWrapper>
			)}
		</div>
	);
};

export default Search;
