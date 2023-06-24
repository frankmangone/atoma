import { Meta, StoryObj } from "@storybook/solid";
import Card from ".";
import type { CardProps } from ".";

export default {
	title: "Card",
	component: Card,
} as Meta;

type Story = StoryObj<CardProps>;

export const Default: Story = {
	args: {
		children: <p>Hey! I'm a card!</p>,
	},
};
