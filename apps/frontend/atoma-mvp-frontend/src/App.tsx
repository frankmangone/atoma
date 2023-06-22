import type { Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

const App: Component = () => {
	return (
		<div class={styles.App}>
			<header class={styles.header}>
				<img src={logo} class={styles.logo} alt="logo" />
				<h1>ATOMA</h1>
				<h3>Compound property search & estimation</h3>
				<div class={styles.card}>
					<label for="compound" class={styles["input-group"]}>
						Compound
						<input type="text" name="compound" placeholder="Compound..." />
					</label>
					<label for="property" class={styles["input-group"]}>
						Property
						<input type="text" name="property" placeholder="Property..." />
					</label>
				</div>
				<div class={styles.card}>
					<div>
						<label for="compound" class={styles["input-group"]}>
							Compound
							<input type="text" name="compound" placeholder="Compound..." />
						</label>
						<label for="property" class={styles["input-group"]}>
							Property
							<input type="text" name="property" placeholder="Property..." />
						</label>
					</div>
					<div>
						<h3>Estimate!</h3>
					</div>
				</div>
			</header>
		</div>
	);
};

export default App;
