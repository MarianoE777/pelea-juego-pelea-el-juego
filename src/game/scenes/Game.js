import { Scene } from "phaser";
import { getPhrase } from "../../services/translations";
import keys from "../../enums/keys";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  init({ language }) {
    this.language = language;
  }

  create() {
    const { vidaP1, vidaP2, jugadorRojoGano, jugadorAzulGano, reiniciarPartida } = keys.sceneGame;

    this.vidasP1 = 3;
    this.vidasP2 = 3;
    this.juegoTerminado = false;

    // Grupo de plataformas estáticas
    const plataformas = this.physics.add.staticGroup();

    // Suelo en la base (Y: 575)
    plataformas.create(400, 575, "suelo");

    // Plataforma flotante
    plataformas.create(400, 464, "plataformaFlotante");

    // Jugador 1 (Azul)
    this.jugador1 = this.physics.add.sprite(200, 300, "jugador1");
    this.jugador1.setBounce(0.05);
    this.jugador1.setCollideWorldBounds(true);
    this.jugador1.direccion = 1;
    this.jugador1.recibiendoDanio = false;

    // Jugador 2 (Rojo)
    this.jugador2 = this.physics.add.sprite(600, 300, "jugador2");
    this.jugador2.setBounce(0.05);
    this.jugador2.setCollideWorldBounds(true);
    this.jugador2.direccion = -1;
    this.jugador2.recibiendoDanio = false;

    // Hitboxes de golpe
    this.ataqueP1 = this.physics.add.image(-100, -100, "hitboxAtaque");
    this.ataqueP1.setActive(false).setVisible(false);
    this.ataqueP1.body.setAllowGravity(false);

    this.ataqueP2 = this.physics.add.image(-100, -100, "hitboxAtaque");
    this.ataqueP2.setActive(false).setVisible(false);
    this.ataqueP2.body.setAllowGravity(false);

    // Colisiones con el mapa
    this.physics.add.collider(this.jugador1, plataformas);
    this.physics.add.collider(this.jugador2, plataformas);

    // Almacenamos la colisión mutua
    this.colisionEntreJugadores = this.physics.add.collider(
      this.jugador1,
      this.jugador2
    );

    // Detección de ataques
    this.physics.add.overlap(this.ataqueP1, this.jugador2, () => {
      if (
        this.ataqueP1.active &&
        !this.jugador2.recibiendoDanio &&
        !this.juegoTerminado
      ) {
        this.recibirDanioJugador(
          this.jugador2,
          this.jugador1.direccion,
          "P2"
        );
      }
    });

    this.physics.add.overlap(this.ataqueP2, this.jugador1, () => {
      if (
        this.ataqueP2.active &&
        !this.jugador1.recibiendoDanio &&
        !this.juegoTerminado
      ) {
        this.recibirDanioJugador(
          this.jugador1,
          this.jugador2.direccion,
          "P1"
        );
      }
    });

    // Marcadores con traducciones
    this.textoVidasP1 = this.add.text(
      20,
      20,
      getPhrase(vidaP1) + " " + this.vidasP1,
      { fontSize: "20px", fill: "#00f" }
    );
    this.textoVidasP2 = this.add.text(
      550,
      20,
      getPhrase(vidaP2) + " " + this.vidasP2,
      { fontSize: "20px", fill: "#f00" }
    );

    // Controles
    this.tecladoF = this.input.keyboard.createCursorKeys();
    this.tecladoWASD = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      attack: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });

    // Guardar referencias para traducción en tiempo real
    this.traducciones = {
      vidaP1,
      vidaP2,
      jugadorRojoGano,
      jugadorAzulGano,
      reiniciarPartida,
    };
  }

  update() {
    if (this.juegoTerminado) return;

    // JUGADOR 1 (AZUL)
    if (this.jugador1 && this.jugador1.active) {
      if (!this.jugador1.recibiendoDanio) {
        if (this.tecladoF.left.isDown) {
          this.jugador1.setVelocityX(-220);
          this.jugador1.direccion = -1;
        } else if (this.tecladoF.right.isDown) {
          this.jugador1.setVelocityX(220);
          this.jugador1.direccion = 1;
        } else {
          this.jugador1.setVelocityX(0);
        }

        if (this.tecladoF.up.isDown && this.jugador1.body.touching.down) {
          this.jugador1.setVelocityY(-420);
        }
      }

      if (
        Phaser.Input.Keyboard.JustDown(this.tecladoF.space) &&
        !this.jugador1.recibiendoDanio
      ) {
        this.ejecutarAtaque(this.jugador1, this.ataqueP1);
      }
    }

    // JUGADOR 2 (ROJO)
    if (this.jugador2 && this.jugador2.active) {
      if (!this.jugador2.recibiendoDanio) {
        if (this.tecladoWASD.left.isDown) {
          this.jugador2.setVelocityX(-220);
          this.jugador2.direccion = -1;
        } else if (this.tecladoWASD.right.isDown) {
          this.jugador2.setVelocityX(220);
          this.jugador2.direccion = 1;
        } else {
          this.jugador2.setVelocityX(0);
        }

        if (this.tecladoWASD.up.isDown && this.jugador2.body.touching.down) {
          this.jugador2.setVelocityY(-420);
        }
      }

      if (
        Phaser.Input.Keyboard.JustDown(this.tecladoWASD.attack) &&
        !this.jugador2.recibiendoDanio
      ) {
        this.ejecutarAtaque(this.jugador2, this.ataqueP2);
      }
    }
  }

  ejecutarAtaque(jugador, hitbox) {
    let offsetX = jugador.direccion === 1 ? 38 : -38;
    hitbox.setPosition(jugador.x + offsetX, jugador.y);
    hitbox.setActive(true).setVisible(true);

    this.time.delayedCall(120, () => {
      hitbox.setActive(false).setVisible(false);
      hitbox.setPosition(-100, -100);
    });
  }

  recibirDanioJugador(victima, direccionAtacante, tagVictima) {
    victima.recibiendoDanio = true;

    if (this.colisionEntreJugadores)
      this.colisionEntreJugadores.active = false;

    victima.setDragX(0);

    if (tagVictima === "P1") {
      this.vidasP1--;
      this.textoVidasP1.setText(
        getPhrase(this.traducciones.vidaP1) + " " + this.vidasP1
      );
    } else {
      this.vidasP2--;
      this.textoVidasP2.setText(
        getPhrase(this.traducciones.vidaP2) + " " + this.vidasP2
      );
    }

    victima.setVelocityX(direccionAtacante * 500);
    victima.setVelocityY(-300);

    victima.setTint(0x00ff00);

    if (this.vidasP1 <= 0 || this.vidasP2 <= 0) {
      this.verificarFinDelJuego();
      return;
    }

    this.time.delayedCall(400, () => {
      if (!this.juegoTerminado && victima && victima.active) {
        victima.recibiendoDanio = false;
        victima.clearTint();
        victima.setVelocityX(0);
        if (this.colisionEntreJugadores)
          this.colisionEntreJugadores.active = true;
      }
    });
  }
  verificarFinDelJuego() {
    this.juegoTerminado = true;
    let mensaje = "";
    let colorTexto = "#fff";

    if (this.vidasP1 <= 0) {
        mensaje = getPhrase(this.traducciones.jugadorRojoGano);
        colorTexto = "#ff0000";
        this.jugador1.disableBody(true, true); 
    } else {
        mensaje = getPhrase(this.traducciones.jugadorAzulGano);
        colorTexto = "#0000ff";
        this.jugador2.disableBody(true, true);
    }



    this.textoVictoria = this.add.text(400, 230, mensaje, {
        fontSize: '40px',
        fill: colorTexto,
        backgroundColor: '#222',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    this.botonReinicio = this.add.text(
      400,  
      340,
      getPhrase(this.traducciones.reiniciarPartida), 
      {
      fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#444',
        padding: { x: 15, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    this.botonReinicio.on("pointerover", () => this.botonReinicio.setStyle({ fill: "#ff0", backgroundColor: "#555" }) );
    this.botonReinicio.on("pointerout", () => this.botonReinicio.setStyle({ fill: "#fff", backgroundColor: "#444" }) );

    this.botonReinicio.on("pointerdown", () => {
        this.scene.restart({ language: this.language });
    });
}
}