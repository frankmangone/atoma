export interface FindCompoundPropertyPayload {
	compoundUuid: string;
	propertyUuid: string;
	temperature: number;
	pressure: number;
}

const query = `
	query FindCompoundProperty(
		$compoundUuid: String!
		$propertyUuid: String!
		$temperature: Float!
		$pressure: Float!
	) {
		compoundProperty(
			input: { compoundUuid: $compoundUuid, propertyUuid: $propertyUuid }
		) {
			__typename

			... on NotFoundError {
				code
				message
			}

			... on CompoundProperty {
				uuid
				compound {
					name
				}
				property {
					name
					key
				}
				value(conditions: { temperature: $temperature, pressure: $pressure })
			}
		}
	}
`;

export const findCompoundProperty = async (
	payload: FindCompoundPropertyPayload
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
