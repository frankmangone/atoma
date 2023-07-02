import { styled } from "solid-styled-components";

export const SelectedValueWrapper = styled("div")`
	display: flex;
	align-items: center;
	border: 2px solid #a237c9;
	align-self: stretch;
	border-radius: 4px;
	padding: 8px 12px;
	cursor: pointer;
`;

export const SelectedValue = styled("div")`
	align-self: stretch;
	flex-grow: 1;
	width: 100%;
	border: none;
	font-size: 14px;
	text-align: left;
`;

//

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
	text-align: left;

	&:hover {
		background-color: #f3fcf7;
	}
`;
