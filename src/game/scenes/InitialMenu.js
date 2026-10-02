import Phaser from "phaser";
import { DE, EN, ES, PT } from "../../enums/languages";
import { FETCHED, FETCHING, READY, TODO } from "../../enums/status";
import { getTranslations, getPhrase } from "../../services/translations";
import keys from "../../enums/keys";

export default class InitialMenu extends Phaser.Scene {
  #textSpanish;
  #textGerman;
  #textEnglish;
  #textPortuguese;

  #wasChangedLanguage = TODO;

  constructor() {
    super("Menu");
  }

  init({ language }) {
    this.language = language;
  }

  create() {
    const { width, height } = this.scale;

    // Botón Español
    const buttonSpanish = this.add
      .rectangle(width * 0.1, height * 0.15, 150, 75, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.getTranslations(ES);
      });

    this.#textSpanish = this.add
      .text(buttonSpanish.x, buttonSpanish.y, "Español", {
        color: "#000000",
        fontSize: "18px",
      })
      .setOrigin(0.5);

    // Botón Alemán
    const buttonGerman = this.add
      .rectangle(width * 0.3, height * 0.15, 150, 75, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.getTranslations(DE);
      });

    this.#textGerman = this.add
      .text(buttonGerman.x, buttonGerman.y, "Aleman", {
        color: "#000000",
        fontSize: "18px",
      })
      .setOrigin(0.5);

    // Botón Inglés
    const buttonEnglish = this.add
      .rectangle(width * 0.5, height * 0.15, 150, 75, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.getTranslations(EN);
      });

    this.#textEnglish = this.add
      .text(buttonEnglish.x, buttonEnglish.y, "Inglés", {
        color: "#000000",
        fontSize: "18px",
      })
      .setOrigin(0.5);

    // Botón Portugués
    const buttonPortuguese = this.add
      .rectangle(width * 0.7, height * 0.15, 150, 75, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.getTranslations(PT);
      });

    this.#textPortuguese = this.add
      .text(buttonPortuguese.x, buttonPortuguese.y, "Portugués", {
        color: "#000000",
        fontSize: "18px",
      })
      .setOrigin(0.5);

    // Botón Jugar con triángulo rotado 45 grados
    const buttonPlay = this.add
      .rectangle(width * 0.5, height * 0.75, 150, 75, 0x44d27e)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.scene.start("Game", { language: this.language });
      });

    // Triángulo rotado 45 grados centrado en el botón
    const triangle = this.add.triangle(
      buttonPlay.x,
      buttonPlay.y,
      0, -15,    // punto superior
      0, 15, // punto inferior izquierdo
      25, 0,  // punto inferior derecho
      0x000000
    );
  }

  update() {
    if (this.#wasChangedLanguage === FETCHED) {
      this.#wasChangedLanguage = READY;
    }
  }

  updateWasChangedLanguage = () => {
    this.#wasChangedLanguage = FETCHED;
  };

  async getTranslations(language) {
    this.language = language;
    this.#wasChangedLanguage = FETCHING;

    await getTranslations(language, this.updateWasChangedLanguage);
  }
}
