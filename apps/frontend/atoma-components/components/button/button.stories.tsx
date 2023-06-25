import { Meta, StoryObj } from "storybook-solidjs";
import Button from ".";
import type { ButtonProps } from ".";

type Story = StoryObj<ButtonProps>;

export const Default: Story = {
	args: {},
};

export default {
	title: "Button",
	// tags: ["autodocs"],
	component: Button,
	argTypes: {},
} as Meta<ButtonProps>;
