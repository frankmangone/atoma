import { styled } from "solid-styled-components";

export const SelectWrapper = styled("div")`
	position: absolute;
	bottom: 0;
	transform: translateY(calc(100% + 4px));
	width: calc(100% - 4px);
	border: 2px solid #a237c9;
	border-radius: 4px;
	background: white;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const SelectOption = styled("button")`
	height: 28px;
	border: none;
	background-color: transparent;
	cursor: pointer;

	&:hover {
		background-color: #f3fcf7;
	}
`;
