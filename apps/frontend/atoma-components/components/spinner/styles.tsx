import { styled } from "styled-components";

interface WrapperProps {
	size: string;
}

export const Wrapper = styled.div<WrapperProps>`
	width: ${(props) => props.size};
	height: ${(props) => props.size};
	animation: spin 1s linear infinite;

	& svg {
		width: 100%;
		height: 100%;
	}

	& path {
		fill: none;
		stroke: white;
		stroke-width: 3;
		stroke-linecap: round;
		stroke-dasharray: 0 78;
		stroke-dashoffset: 0;
		transform-origin: center;
		transform: rotate(-90deg);
		animation: dash 1s linear infinite;
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 0 78;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 78 78;
			stroke-dashoffset: -39;
		}
		100% {
			stroke-dasharray: 0 78;
			stroke-dashoffset: -78;
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`;
