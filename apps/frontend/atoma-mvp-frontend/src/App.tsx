import type { Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { Card } from "@atoma/component-library";

const App: Component = () => {
	return (
		<div class={styles.App}>
			<main class={styles.container}>
				<img src={logo} class={styles.logo} alt="logo" />
				<h1>ATOMA</h1>
				<h3>Compound property search & estimation</h3>
				<div class={styles.card}>
					<div class={styles["input-group"]} style={{ "flex-basis": "250px" }}>
						<label for="compound" class={styles.label}>
							Compound
						</label>

						<input
							type="text"
							name="compound"
							class={styles.input}
							placeholder="Compound..."
						/>
					</div>

					<div class={styles["input-group"]} style={{ "flex-basis": "250px" }}>
						<label for="property" class={styles.label}>
							Property
						</label>

						<input
							type="text"
							name="property"
							class={styles.input}
							placeholder="Property..."
						/>
					</div>
				</div>
				<div class={styles.card}>
					<div
						style={{
							"flex-basis": "50%",
							gap: "20px",
							display: "flex",
							"flex-direction": "column",
							"align-items": "flex-end",
						}}
					>
						<div class={styles["input-group"]} style={{ width: "250px" }}>
							<label for="temperature" class={styles.label}>
								Temperature
							</label>
							<input
								type="text"
								class={styles.input}
								name="temperature"
								placeholder="Temperature..."
							/>
						</div>
						<div class={styles["input-group"]} style={{ width: "250px" }}>
							<label for="pressure" class={styles.label}>
								Pressure
							</label>
							<input
								type="text"
								class={styles.input}
								name="pressure"
								placeholder="Pressure..."
							/>
						</div>
					</div>
					<div style={{ "flex-basis": "50%" }}>
						<h3>Estimate!</h3>
					</div>
				</div>
			</main>
		</div>
	);
};

export default App;
