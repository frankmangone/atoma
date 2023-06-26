import { createSignal, type Component, createResource } from "solid-js";

import logo from "../../logo.svg";
import styles from "./property-estimation.module.css";
import {
	Card,
	Input,
	Button,
	Divider,
	Spinner,
} from "@atoma/component-library";
import {
	FindCompoundPropertyPayload,
	findCompoundProperty,
} from "../../queries/findCompoundProperty";

const PropertyEstimationPage: Component = () => {
	const [compound, setCompound] = createSignal<string>("");
	const [property, setProperty] = createSignal<string>("");
	const [temperature, setTemperature] = createSignal<number>();
	const [pressure, setPressure] = createSignal<number>();

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

	return (
		<div class={styles.App}>
			<main class={styles.container}>
				<img src={logo} class={styles.logo} alt="logo" />
				{/** TODO: Typography components */}
				<h1>ATOMA</h1>
				<h3>Compound property search & estimation</h3>
				<Card style={{ "justify-content": "center" }}>
					<Input
						label="Compound"
						name="compound"
						placeholder="Compound..."
						value={compound()}
						onChange={(e: any) => setCompound(e.target.value)}
						style={{ "flex-basis": "250px" }}
					/>
					<Input
						label="Property"
						name="property"
						placeholder="Property..."
						value={property()}
						onChange={(e: any) => setProperty(e.target.value)}
						style={{ "flex-basis": "250px" }}
					/>
				</Card>
				<Card>
					<div
						style={{
							"flex-grow": 1,
							"flex-basis": "49%",
							gap: "20px",
							display: "flex",
							"flex-direction": "column",
							"align-items": "flex-end",
						}}
					>
						<Input
							label="Temperature"
							name="temperature"
							placeholder="Temperature..."
							value={temperature()}
							onChange={(e: any) => setTemperature(parseFloat(e.target.value))}
							style={{ width: "250px" }}
						/>
						<Input
							label="Pressure"
							name="pressure"
							placeholder="Pressure..."
							value={pressure()}
							onChange={(e: any) => setPressure(parseFloat(e.target.value))}
							style={{ width: "250px" }}
						/>
					</div>
					<Divider direction="vertical" />
					<div style={{ "flex-grow": 1, "flex-basis": "49%" }}>
						<h3>Result</h3>
						{/** TODO: Handle failure scenarios */}
						<p>{data()?.compoundProperty.value}</p>
					</div>
				</Card>
				<Button
					style={{ width: "400px", height: "50px", "align-self": "center" }}
					// disabled={loading}
					onClick={fetch}
				>
					{data?.loading ? <Spinner /> : "Estimate"}
				</Button>
			</main>
		</div>
	);
};

export default PropertyEstimationPage;
