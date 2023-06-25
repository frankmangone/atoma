import { Meta, StoryObj } from "storybook-solidjs";
import Input from ".";
import type { InputProps } from ".";

type Story = StoryObj<InputProps>;

export const Default: Story = {
	args: {
		label: "Label",
		name: "some input",
		placeholder: "Placeholder...",
	},
};

export default {
	title: "Input",
	// tags: ["autodocs"],
	// render: (props) => <Input {...props} />,
	component: Input,
	argTypes: {
		label: { control: "text" },
		placeholder: { control: "text" },
		name: { control: "text" },
	},
} as Meta<InputProps>;
