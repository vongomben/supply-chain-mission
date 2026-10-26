import { gameConfig } from "./data/game-config.js";
import { createGame } from "./engine.js";
import "./styles/main.css";

document.title = gameConfig.meta?.titolo || "Missione ITS";

const root = document.getElementById("app");
if (!root) {
  throw new Error("Manca #app in index.html");
}

createGame(root, gameConfig);
