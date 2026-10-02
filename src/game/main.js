import { Game as MainGame } from "./scenes/Game";
import { AUTO, Scale, Game } from "phaser";
import { Preload } from "./scenes/Preload";
import InitialMenu from "./scenes/InitialMenu";

const config = {
  type: AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#000000",
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 700 },
      debug: false,
    },
  },
  scene: [Preload, MainGame, InitialMenu],
};

const StartGame = (parent) => {
  return new Game({ ...config, parent });
};

export default StartGame;
