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
import { useData } from "./use-data";

const PropertyEstimationPage: Component = () => {
	const {
		compound,
		setCompound,
		property,
		setProperty,
		temperature,
		setTemperature,
		pressure,
		setPressure,
		fetch,
		data,
	} = useData();

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
					style={{ width: "400px", height: "40px", "align-self": "center" }}
					disabled={data?.loading}
					onClick={fetch}
				>
					{data?.loading ? <Spinner size="25px" /> : "Estimate"}
				</Button>
			</main>
		</div>
	);
};

export default PropertyEstimationPage;
