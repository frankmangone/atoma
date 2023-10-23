import React from "react";
import { SearchIcon } from "./icons/search";
import { TimesIcon } from "./icons/times";

const ICONS = {
	search: SearchIcon,
	times: TimesIcon,
} as const;

type IconName = keyof typeof ICONS;

export interface IconProps {
	icon: IconName;
	size?: number;
}

export const Icon: React.FC<IconProps> = (props) => {
	const { icon, size = 24 } = props;
	const IconComponent = ICONS[icon];

	return <IconComponent width={`${size}px`} height={`${size}px`} />;
};

export default Icon;
