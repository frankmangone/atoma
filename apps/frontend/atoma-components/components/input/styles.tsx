import { styled } from "solid-styled-components";

export const Wrapper = styled("div")`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	font-size: 12px;
	gap: 8px;
`;

export const Label = styled("label")`
	font-weight: 700;
	color: #5d6f67;
`;

export const Input = styled("input")`
	border: 2px solid #5d6f67;
	border-radius: 4px;
	padding: 8px 12px;
	align-self: stretch;

	&:active,
	&:focus {
		border-color: #a237c9;
		outline: none;
	}
`;
