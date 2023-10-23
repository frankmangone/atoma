import { styled } from "styled-components";

const BaseDivider = styled.div`
	align-self: stretch;
	background-color: #daeee4;
`;

export const HorizontalDivider = styled(BaseDivider)`
	height: 1px;
	margin-top: 4px;
	margin-bottom: 4px;
`;

export const VerticalDivider = styled(BaseDivider)`
	width: 1px;
	margin-left: 4px;
	margin-right: 4px;
`;
