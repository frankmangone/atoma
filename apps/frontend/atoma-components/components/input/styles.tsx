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

export const InputWrapper = styled("div")`
	display: flex;
	align-items: center;
	border: 2px solid #5d6f67;
	align-self: stretch;
	border-radius: 4px;
	padding: 8px 12px;
`;

export const Input = styled("input")`
	align-self: stretch;
	flex-grow: 1;
	width: 100%;
	border: none;

	&:active,
	&:focus {
		border-color: #a237c9;
		outline: none;
	}
`;
