import logo from "../../assets/logo.png";
import styles from "./property-estimation.module.css";
import {
	Card,
	Input,
	Button,
	Divider,
	Spinner,
	Search,
} from "@atoma/component-library";
import { useData } from "./use-data";
import type { Component } from "solid-js";

const PropertyEstimationPage: Component = () => {
	const { formValues, setFormValue, fetch, data } = useData();
	const { compoundUuid, propertyUuid, temperature, pressure } = formValues();

	return (
		<div class={styles.App}>
			<main class={styles.container}>
				<img src={logo} class={styles.logo} alt="logo" />
				{/** TODO: Typography components */}
				<h1 style={{ color: "#8e2eb2" }}>ATOMA</h1>
				<h3>Compound property search & estimation</h3>
				<Card style={{ "justify-content": "center" }}>
					<Search
						label="Compound"
						name="compound"
						placeholder="Compound..."
						value={compoundUuid}
						onChange={(e: any) => setFormValue("compoundUuid", e.target.value)}
						style={{ "flex-basis": "250px" }}
					/>
					<Search
						label="Property"
						name="property"
						placeholder="Property..."
						value={propertyUuid}
						onChange={(e: any) => setFormValue("propertyUuid", e.target.value)}
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
							value={temperature}
							onChange={(e: any) =>
								setFormValue("temperature", parseFloat(e.target.value))
							}
							style={{ width: "250px" }}
						/>
						<Input
							label="Pressure"
							name="pressure"
							placeholder="Pressure..."
							value={pressure}
							onChange={(e: any) =>
								setFormValue("pressure", parseFloat(e.target.value))
							}
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