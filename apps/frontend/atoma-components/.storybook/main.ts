const config = {
	stories: [
		"../components/**/*.mdx",
		"../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		'@storybook/preset-typescript',
	],
	docs: {
		autodocs: "tag",
	},
};

export default config;
