import { Component } from "solid-js";
import { SearchIcon } from "./icons/search";

const ICONS = {
	search: SearchIcon,
} as const;

type IconName = keyof typeof ICONS;

export interface IconProps {
	icon: IconName;
	size?: number;
}

export const Icon: Component<IconProps> = (props) => {
	const { icon, size = 24 } = props;
	const IconComponent = ICONS[icon];

	return <IconComponent width={`${size}px`} height={`${size}px`} />;
};

export default Icon;
