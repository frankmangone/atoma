import { AsProps } from "solid-styled-components";
import { Wrapper, Label, Input, InputWrapper } from "./styles";
import type { Component, JSX } from "solid-js";
// import SearchIcon from "./icon";

export type SearchProps = JSX.HTMLAttributes<HTMLDivElement> &
	JSX.InputHTMLAttributes<HTMLInputElement> &
	AsProps & {
		label: string;
		name: string;
		placeholder?: string;
	};

export const Search: Component<SearchProps> = (props) => {
	const { value, onInput, label, name, placeholder, ...rest } = props;

	return (
		<Wrapper {...rest}>
			<Label for={name}>{label}</Label>
			<InputWrapper>
				<Input
					value={value}
					onInput={onInput}
					type="text"
					name={name}
					placeholder={placeholder}
				/>
				{/* <SearchIcon /> */}
			</InputWrapper>
			{/* <SearchResults>
				<SearchResult />
				<SearchResult />
				<SearchResult />
			</SearchResults> */}
		</Wrapper>
	);
};

export default Search;
