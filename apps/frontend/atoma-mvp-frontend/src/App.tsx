import type { Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import {
	Card,
	Input,
	Button,
	Divider,
	Spinner,
} from "@atoma/component-library";
import { createQuery } from "@tanstack/solid-query";
import { findCompoundProperty } from "./queries/findCompoundProperty";

const App: Component = () => {
	const query = createQuery(() => ["todos"], findCompoundProperty, {
		enabled: false,
	});

	const { refetch: fetch, isLoading } = query;

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
					<Divider direction="vertical" />
					<div style={{ "flex-grow": 1, "flex-basis": "49%" }}>
						<h3>Result</h3>
						{/** TODO: Handle failure scenarios */}
						<p>{query.data?.data.compoundProperty.value}</p>
					</div>
				</Card>
				<Button
					style={{ width: "400px", "align-self": "center" }}
					// disabled={isLoading}
					onClick={() => fetch()}
				>
					Estimate
					{/* {isLoading ? <Spinner /> : "Estimate"} */}
				</Button>
			</main>
		</div>
	);
};

export default App;
