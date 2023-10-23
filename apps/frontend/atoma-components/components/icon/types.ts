import React from "react";

export type SvgProps = React.HTMLAttributes<SVGElement> & {
	width?: number | string;
	height?: number | string;
};
