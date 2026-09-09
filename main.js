import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 }, // Mayor gravedad para un control arcade más responsivo
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let vidasP1 = 3;
let vidasP2 = 3;
let juegoTerminado = false;
let textoVidasP1, textoVidasP2, textoVictoria, botonReinicio;
let colisionEntreJugadores;

function preload() {
    if (!this.textures.exists('suelo')) {
        let sueloCanvas = this.textures.createCanvas('suelo', 800, 50);
        sueloCanvas.context.fillStyle = '#228B22';
        sueloCanvas.context.fillRect(0, 0, 800, 50);
        sueloCanvas.refresh();
    }

    // Plataforma pequeña flotante (Color gris)
    if (!this.textures.exists('plataformaFlotante')) {
        let platCanvas = this.textures.createCanvas('plataformaFlotante', 150, 15);
        platCanvas.context.fillStyle = '#888888';
        platCanvas.context.fillRect(0, 0, 150, 15);
        platCanvas.refresh();
    }

    if (!this.textures.exists('jugador1')) {
        let p1Canvas = this.textures.createCanvas('jugador1', 32, 48);
        p1Canvas.context.fillStyle = '#0000FF';
        p1Canvas.context.fillRect(0, 0, 32, 48);
        p1Canvas.refresh();
    }

    if (!this.textures.exists('jugador2')) {
        let p2Canvas = this.textures.createCanvas('jugador2', 32, 48);
        p2Canvas.context.fillStyle = '#FF0000';
        p2Canvas.context.fillRect(0, 0, 32, 48);
        p2Canvas.refresh();
    }

    if (!this.textures.exists('hitboxAtaque')) {
        let ataqueCanvas = this.textures.createCanvas('hitboxAtaque', 45, 15);
        ataqueCanvas.context.fillStyle = '#FFFF00';
        ataqueCanvas.context.fillRect(0, 0, 45, 15);
        ataqueCanvas.refresh();
    }
}

function create() {
    vidasP1 = 3;
    vidasP2 = 3;
    juegoTerminado = false;

    // Grupo de plataformas estáticas
    const plataformas = this.physics.add.staticGroup();
    
    // Suelo en la base (Y: 575)
    plataformas.create(400, 575, 'suelo');

    // --- NUEVO: Plataforma a 1.8 veces la altura de los personajes desde el suelo ---
    // Altura personaje = 48px. 48 * 1.8 = 86.4px de elevación desde el suelo estable (Y: 550)
    // Posición Y de la plataforma = 550 - 86 = 464
    plataformas.create(400, 464, 'plataformaFlotante');

    // Jugador 1 (Azul)
    this.jugador1 = this.physics.add.sprite(200, 300, 'jugador1');
    this.jugador1.setBounce(0.05);
    this.jugador1.setCollideWorldBounds(true);
    this.jugador1.direccion = 1; 
    this.jugador1.recibiendoDanio = false;

    // Jugador 2 (Rojo)
    this.jugador2 = this.physics.add.sprite(600, 300, 'jugador2');
    this.jugador2.setBounce(0.05);
    this.jugador2.setCollideWorldBounds(true);
    this.jugador2.direccion = -1;
    this.jugador2.recibiendoDanio = false;

    // Hitboxes de golpe
    this.ataqueP1 = this.physics.add.image(-100, -100, 'hitboxAtaque');
    this.ataqueP1.setActive(false).setVisible(false);
    this.ataqueP1.body.setAllowGravity(false);

    this.ataqueP2 = this.physics.add.image(-100, -100, 'hitboxAtaque');
    this.ataqueP2.setActive(false).setVisible(false);
    this.ataqueP2.body.setAllowGravity(false);

    // Colisiones con el mapa (Suelo y plataforma flotante)
    this.physics.add.collider(this.jugador1, plataformas);
    this.physics.add.collider(this.jugador2, plataformas);
    
    // Almacenamos la colisión mutua
    colisionEntreJugadores = this.physics.add.collider(this.jugador1, this.jugador2);

    // Detección de ataques
    this.physics.add.overlap(this.ataqueP1, this.jugador2, () => {
        if (this.ataqueP1.active && !this.jugador2.recibiendoDanio && !juegoTerminado) {
            recibirDanioJugador(this, this.jugador2, this.jugador1.direccion, 'P2');
        }
    });

    this.physics.add.overlap(this.ataqueP2, this.jugador1, () => {
        if (this.ataqueP2.active && !this.jugador1.recibiendoDanio && !juegoTerminado) {
            recibirDanioJugador(this, this.jugador1, this.jugador2.direccion, 'P1');
        }
    });

    // Marcadores
    textoVidasP1 = this.add.text(20, 20, `Vidas P1 (Azul): ${vidasP1}`, { fontSize: '20px', fill: '#00f' });
    textoVidasP2 = this.add.text(550, 20, `Vidas P2 (Rojo): ${vidasP2}`, { fontSize: '20px', fill: '#f00' });

    // Controles
    this.tecladoF = this.input.keyboard.createCursorKeys(); 
    this.tecladoWASD = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        attack: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
}

function update() {
    if (juegoTerminado) return;

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

        if (Phaser.Input.Keyboard.JustDown(this.tecladoF.space) && !this.jugador1.recibiendoDanio) {
            ejecutarAtaque(this, this.jugador1, this.ataqueP1);
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

        if (Phaser.Input.Keyboard.JustDown(this.tecladoWASD.attack) && !this.jugador2.recibiendoDanio) {
            ejecutarAtaque(this, this.jugador2, this.ataqueP2);
        }
    }
}

function ejecutarAtaque(scene, jugador, hitbox) {
    let offsetX = jugador.direccion === 1 ? 38 : -38;
    hitbox.setPosition(jugador.x + offsetX, jugador.y);
    hitbox.setActive(true).setVisible(true);

    scene.time.delayedCall(120, () => {
        hitbox.setActive(false).setVisible(false);
        hitbox.setPosition(-100, -100);
    });
}

function recibirDanioJugador(scene, victima, direccionAtacante, tagVictima) {
    victima.recibiendoDanio = true;

    // --- CORRECCIÓN DEFINITIVA DE KNOCKBACK ---
    // Desactivamos la colisión mutua para que no haya teletransporte por solapamiento
    if (colisionEntreJugadores) colisionEntreJugadores.active = false;
    
    // Le quitamos la fricción del suelo durante el empuje
    victima.setDragX(0); 

    if (tagVictima === 'P1') {
        vidasP1--;
        textoVidasP1.setText(`Vidas P1 (Azul): ${vidasP1}`);
    } else {
        vidasP2--;
        textoVidasP2.setText(`Vidas P2 (Rojo): ${vidasP2}`);
    }

    // Aplicamos una velocidad de lanzamiento inicial instantánea y limpia
    victima.setVelocityX(direccionAtacante * 500); 
    victima.setVelocityY(-300); // Lanzamiento sutil hacia arriba
    
    // Tinte verde al recibir el daño
    victima.setTint(0x00ff00);

    if (vidasP1 <= 0 || vidasP2 <= 0) {
        verificarFinDelJuego(scene);
        return;
    }

    // El tiempo de aturdimiento dura 400ms para asegurar que el recorrido por el aire se vea completo
    scene.time.delayedCall(400, () => {
        if (!juegoTerminado && victima && victima.active) {
            victima.recibiendoDanio = false;
            victima.clearTint();
            victima.setVelocityX(0); // Detener el empuje suavemente
            if (colisionEntreJugadores) colisionEntreJugadores.active = true;
        }
    });
}

function verificarFinDelJuego(scene) {
    juegoTerminado = true;
    let mensaje = "";
    let colorTexto = "#fff";

    if (vidasP1 <= 0) {
        mensaje = "¡EL JUGADOR ROJO GANÓ!";
        colorTexto = "#ff0000";
        scene.jugador1.disableBody(true, true); 
    } else {
        mensaje = "¡EL JUGADOR AZUL GANÓ!";
        colorTexto = "#0000ff";
        scene.jugador2.disableBody(true, true);
    }

    textoVictoria = scene.add.text(400, 230, mensaje, {
        fontSize: '40px',
        fill: colorTexto,
        backgroundColor: '#222',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    botonReinicio = scene.add.text(400, 340, 'REINICIAR PARTIDA', {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#444',
        padding: { x: 15, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    botonReinicio.on('pointerover', () => botonReinicio.setStyle({ fill: '#ff0', backgroundColor: '#555' }));
    botonReinicio.on('pointerout', () => botonReinicio.setStyle({ fill: '#fff', backgroundColor: '#444' }));

    botonReinicio.on('pointerdown', () => {
        scene.scene.restart();
    });
}