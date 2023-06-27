import { createResource, createSignal } from "solid-js";
import {
	type FindCompoundPropertyPayload,
	findCompoundProperty,
} from "../../queries/findCompoundProperty";

export const useData = () => {
	const [formValues, setFormValues] = createSignal<
		Partial<FindCompoundPropertyPayload>
	>({
		compoundUuid: "9d7c71ab-ac47-45da-b5b4-62795f126f7c",
		propertyUuid: "5a6cdccd-f1bc-40af-998a-295c5a86a6c2",
		temperature: 39,
		pressure: 1000,
	});

	const [query, setQuery] = createSignal<FindCompoundPropertyPayload>();
	const [data] = createResource(query, findCompoundProperty);

	const setFormValue = (
		key: keyof FindCompoundPropertyPayload,
		value: FindCompoundPropertyPayload[typeof key]
	) => {
		setFormValues({
			...formValues(),
			[key]: value,
		});
	};

	const fetch = () => {
		const payload = formValues();
		const { compoundUuid, propertyUuid, temperature, pressure } = payload;

		// TODO: Better validation
		if (
			temperature === undefined ||
			pressure === undefined ||
			compoundUuid === undefined ||
			propertyUuid === undefined
		) {
			return;
		}

		setQuery(payload as FindCompoundPropertyPayload);
	};

	return {
		fetch,
		formValues,
		setFormValue,
		data,
	};
};
