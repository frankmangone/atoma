import { styled } from "solid-styled-components";

export const Button = styled("button")`
	background-color: #951cb8;
	border: 2px solid #951cb8;
	border-radius: 4px;
	color: white;
	cursor: pointer;
	font-size: 16px;
	font-weight: 500;
	padding: 8px 20px;

	&:hover {
		background-color: #b361db;
		border-color: #cc9ced;
	}
`;
