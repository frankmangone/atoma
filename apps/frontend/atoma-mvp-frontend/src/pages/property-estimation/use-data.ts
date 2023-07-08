import { Setter, createResource, createSignal } from "solid-js";
import {
	type FindCompoundPropertyPayload,
	findCompoundProperty,
} from "../../queries/find-compound-property";
import { findCompoundsByName } from "../../queries/find-compound-by-name";

type Setters<T> = {
	[K in keyof T]: Setter<T[K]>;
};

export const useData = () => {
	// Form values
	const [compoundUuid, setCompoundUuid] = createSignal<string>("");
	const [propertyUuid, setPropertyUuid] = createSignal<string>("");
	const [temperature, setTemperature] = createSignal<number>();
	const [pressure, setPressure] = createSignal<number>();

	const formValues = {
		compoundUuid,
		propertyUuid,
		temperature,
		pressure,
	};

	const setters: Setters<FindCompoundPropertyPayload> = {
		compoundUuid: setCompoundUuid,
		propertyUuid: setPropertyUuid,
		temperature: setTemperature,
		pressure: setPressure,
	};

	const setFormValue = <K extends keyof FindCompoundPropertyPayload>(
		key: K,
		value: FindCompoundPropertyPayload[K]
	) => {
		const setter = setters[key];
		setter(() => value);
	};

	const [findCompoundPropertyQuery, setFindCompoundPropertyQuery] =
		createSignal<FindCompoundPropertyPayload>();
	const [compoundPropertyData] = createResource(
		findCompoundPropertyQuery,
		findCompoundProperty
	);

	const [findCompoundsQuery, setFindCompoundsQuery] = createSignal<any>();
	const [compoundData] = createResource(
		findCompoundsQuery,
		findCompoundsByName
	);

	const estimateProperty = () => {
		const payload = {
			compoundUuid: compoundUuid(),
			propertyUuid: propertyUuid(),
			temperature: temperature(),
			pressure: pressure(),
		};

		// TODO: Better validation
		if (
			payload.temperature === undefined ||
			payload.pressure === undefined ||
			payload.compoundUuid === undefined ||
			payload.propertyUuid === undefined
		) {
			return;
		}

		setFindCompoundPropertyQuery(payload as FindCompoundPropertyPayload);
	};

	return {
		estimateProperty,
		formValues,
		setFormValue,
		compoundPropertyData,
	};
};
