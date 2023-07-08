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
	const { formValues, setFormValue, estimateProperty, compoundPropertyData } =
		useData();
	const { compoundUuid, propertyUuid, temperature, pressure } = formValues;

	return (
		<div class={styles.App}>
			<main class={styles.container}>
				<img src={logo} class={styles.logo} alt="logo" />
				{/** TODO: Typography components */}
				<h1 style={{ "font-weight": "semibold", color: "#8e2eb2" }}>ATOMA</h1>
				<h3>Compound property search & estimation</h3>
				<Card style={{ "justify-content": "center" }}>
					<Search
						label="Compound"
						name="compound"
						placeholder="Compound..."
						loading={true}
						value={compoundUuid}
						onSelect={(value) => setFormValue("compoundUuid", value)}
						style={{ "flex-basis": "250px" }}
					/>
					<Search
						label="Property"
						name="property"
						placeholder="Property..."
						loading={true}
						value={propertyUuid}
						onSelect={(value) => setFormValue("propertyUuid", value)}
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
							onChange={(e: any) =>
								setFormValue("temperature", parseFloat(e.target.value))
							}
							style={{ width: "250px" }}
						/>
						<Input
							label="Pressure"
							name="pressure"
							placeholder="Pressure..."
							value={pressure()}
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
						<p>{compoundPropertyData()?.compoundProperty.value}</p>
					</div>
				</Card>
				<Button
					style={{ width: "400px", height: "40px", "align-self": "center" }}
					disabled={compoundPropertyData?.loading}
					onClick={estimateProperty}
				>
					{compoundPropertyData?.loading ? <Spinner size="25px" /> : "Estimate"}
				</Button>
			</main>
		</div>
	);
};

export default PropertyEstimationPage;
