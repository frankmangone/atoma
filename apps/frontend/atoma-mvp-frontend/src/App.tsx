import type { Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { Card, Input } from "@atoma/component-library";

const App: Component = () => {
	return (
		<div class={styles.App}>
			<main class={styles.container}>
				<img src={logo} class={styles.logo} alt="logo" />
				<h1>ATOMA</h1>
				<h3>Compound property search & estimation</h3>
				<Card style={{ "justify-content": "center" }}>
					<Input
						label="Compound"
						name="compound"
						placeholder="Compound..."
						style={{ "flex-basis": "250px" }}
					/>
					<Input
						label="Property"
						name="property"
						placeholder="Property..."
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
							style={{ width: "250px" }}
						/>
						<Input
							label="Pressure"
							name="pressure"
							placeholder="Pressure..."
							style={{ width: "250px" }}
						/>
					</div>
					{/** TODO: Move to "Divider" component */}
					<div
						style={{
							width: "1px",
							"align-self": "stretch",
							"margin-left": "4px",
							"margin-right": "4px",
							background: "#DAEEE4",
						}}
					/>
					<div style={{ "flex-grow": 1, "flex-basis": "49%" }}>
						<h3>Result</h3>
					</div>
				</Card>
				<button>Estimate</button>
			</main>
		</div>
	);
};

export default App;
