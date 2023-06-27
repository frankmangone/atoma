import { createResource, createSignal } from "solid-js";
import {
	type FindCompoundPropertyPayload,
	findCompoundProperty,
} from "../../queries/findCompoundProperty";

export const useData = () => {
	const [compound, setCompound] = createSignal<string>(
		"9d7c71ab-ac47-45da-b5b4-62795f126f7c"
	);
	const [property, setProperty] = createSignal<string>(
		"5a6cdccd-f1bc-40af-998a-295c5a86a6c2"
	);
	const [temperature, setTemperature] = createSignal<number>(39);
	const [pressure, setPressure] = createSignal<number>(1000);

	const [query, setQuery] = createSignal<FindCompoundPropertyPayload>();

	const [data] = createResource(query, findCompoundProperty);

	const fetch = () => {
		const t = temperature();
		const p = pressure();

		if (t === undefined || p === undefined) {
			return;
		}

		setQuery({
			compoundUuid: compound(),
			propertyUuid: property(),
			temperature: t,
			pressure: p,
		});
	};

	return {
		fetch,
		compound,
		setCompound,
		property,
		setProperty,
		temperature,
		setTemperature,
		pressure,
		setPressure,
		data,
	};
};
