import { styled } from "solid-styled-components";

export const Button = styled("button")`
	align-items: center;
	background-color: #8e2eb2;
	border: none;
	border-radius: 4px;
	color: white;
	cursor: pointer;
	display: flex;
	justify-content: center;
	font-size: 16px;
	font-weight: 500;
	padding: 8px 20px;

	&:hover {
		background-color: #ac48d0;
	}
`;
