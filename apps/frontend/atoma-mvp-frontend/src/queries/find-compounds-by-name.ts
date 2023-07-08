export interface FindCompoundsByNamePayload {
	name: string;
}

export type FindCompoundsByNameResult = Array<{
	uuid: string;
	name: string;
}>;

interface QueryResult {
	compounds: {
		nodes: FindCompoundsByNameResult;
	};
}

const query = `
	query FindCompoundsByName($name: String!) {
		compounds(options: { name: $name, first: 4 }) {
			nodes {
				uuid
				name
			}
		}
	}
`;

export const findCompoundsByName = async (
	payload: FindCompoundsByNamePayload
): Promise<FindCompoundsByNameResult> => {
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

	await new Promise((resolve) => setTimeout(() => resolve(true), 2000));

	const result = await response.json();
	const data = result?.data as QueryResult;

	return data.compounds.nodes;
};
