export interface FindPropertiesByNamePayload {
	name: string;
}

export type FindPropertiesByNameResult = Array<{
	uuid: string;
	name: string;
}>;

interface QueryResult {
	compounds: {
		nodes: FindPropertiesByNameResult;
	};
}

const query = `
	query FindPropertiesByName($name: String!) {
		properties(options: { name: $name, first: 4 }) {
			nodes {
				uuid
				name
			}
		}
	}
`;

export const findPropertiesByName = async (
	payload: FindPropertiesByNamePayload
): Promise<FindPropertiesByNameResult> => {
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

	const result = await response.json();
	const data = result?.data as QueryResult;

	return data.compounds.nodes;
};
