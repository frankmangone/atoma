import type { Meta, StoryObj } from "@storybook/html";
import type { ComponentProps } from "solid-js";

import Card from ".";
import type { CardProps } from ".";

type Story = StoryObj<CardProps>;

// export const Default: Story = {
// 	args: {
// 		initialValue: 12,
// 		theme: "default",
// 	},
// };

// export const Second: Story = {
// 	args: {
// 		initialValue: 35,
// 	},
// };

// export const Thrid: Story = {
// 	args: {
// 		initialValue: 3225,
// 	},
// };

export default {
	title: "Example/Counter",
	tags: ["autodocs"],
	/**
	 * Here you need to render JSX for HMR work!
	 *
	 * render: Counter won't trigger HMR updates
	 */
	render: (props) => <Card {...props} />,
	argTypes: {
		initialValue: { control: "number" },
		theme: {
			options: ["default", "red"],
			control: { type: "radio" },
		},
	},
} as Meta<ComponentProps<typeof Card>>;
