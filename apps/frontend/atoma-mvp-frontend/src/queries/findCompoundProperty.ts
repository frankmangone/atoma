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

export const findCompoundProperty = async () => {
	const response = await fetch("http://localhost:3000/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			query,
			variables: {
				compoundUuid: "9d7c71ab-ac47-45da-b5b4-62795f126f7c",
				propertyUuid: "5a6cdccd-f1bc-40af-998a-295c5a86a6c2",
				temperature: 38,
				pressure: 10000,
			},
		}),
	});

	return response.json();
};
