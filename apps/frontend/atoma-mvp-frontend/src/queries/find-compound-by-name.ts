export interface FindCompoundsByNamePayload {
	name: string;
}

const query = `
	query FindCompoundsByName($name: String!) {
		compounds(input: { name: $name, first: 4 }) {
			uuid
			name
		}
	}
`;

export const findCompoundsByName = async (
	payload: FindCompoundsByNamePayload
) => {
	const response = await fetch("http://localhost:3000/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			query,
			variables: payload,
		}),
	});

	const { data } = await response.json();

	return data;
};
