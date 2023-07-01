import type { Component } from "solid-js";
import Input, { InputProps } from "../input";
import Icon from "../icon";

export type SearchProps = Omit<InputProps, "rightComponent">;

export const Search: Component<SearchProps> = (props) => {
	return <Input rightComponent={<Icon icon="search" size={20} />} {...props} />;
};

export default Search;
