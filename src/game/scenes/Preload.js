import { Scene } from "phaser";
import {
  getLanguageConfig,
  getTranslations,
} from "../../services/translations";

export class Preload extends Scene {
  #language;
  constructor() {
    super("Preload");
  }

  preload() {
    this.#language = getLanguageConfig();

    // Generar texturas por canvas (sin assets externos)
    if (!this.textures.exists("suelo")) {
      let sueloCanvas = this.textures.createCanvas("suelo", 800, 50);
      sueloCanvas.context.fillStyle = "#228B22";
      sueloCanvas.context.fillRect(0, 0, 800, 50);
      sueloCanvas.refresh();
    }

    if (!this.textures.exists("plataformaFlotante")) {
      let platCanvas = this.textures.createCanvas("plataformaFlotante", 150, 15);
      platCanvas.context.fillStyle = "#888888";
      platCanvas.context.fillRect(0, 0, 150, 15);
      platCanvas.refresh();
    }

    if (!this.textures.exists("jugador1")) {
      let p1Canvas = this.textures.createCanvas("jugador1", 32, 48);
      p1Canvas.context.fillStyle = "#0000FF";
      p1Canvas.context.fillRect(0, 0, 32, 48);
      p1Canvas.refresh();
    }

    if (!this.textures.exists("jugador2")) {
      let p2Canvas = this.textures.createCanvas("jugador2", 32, 48);
      p2Canvas.context.fillStyle = "#FF0000";
      p2Canvas.context.fillRect(0, 0, 32, 48);
      p2Canvas.refresh();
    }

    if (!this.textures.exists("hitboxAtaque")) {
      let ataqueCanvas = this.textures.createCanvas("hitboxAtaque", 45, 15);
      ataqueCanvas.context.fillStyle = "#FFFF00";
      ataqueCanvas.context.fillRect(0, 0, 45, 15);
      ataqueCanvas.refresh();
    }
  }

  create() {
    getTranslations(this.#language, () =>
      this.scene.start("Menu", { language: this.#language })
    );
  }
}
