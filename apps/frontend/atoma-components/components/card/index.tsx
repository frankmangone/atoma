import styles from "./styles.css";
import { children, type Component, type JSX } from "solid-js";

export interface CardProps {
	children: JSX.Element;
}

const Card: Component<CardProps> = (props) => {
	const c = children(() => props.children);
	return <div class={styles.card}>{c()}</div>;
};

export default Card;
