## AGENTS.md

## Proyecto
Videojuego desarrollado para la Game Jam de Desarrollo Tecnológico.

## Stack
- JavaScript
- Node.js
- Vite
- Phaser

## Objetivo
Desarrollar un videojuego pequeño aplicando:
- Buenas prácticas de organización de código.
- Desarrollo asistido por agentes de programación.

## Arquitectura
El proyecto está organizado de la siguiente manera:
src/
├── scenes/
├── entities/
├── systems/
├── patterns/
└── assets/

## Reglas para el agente
- Utilizar JavaScript.
- No agregar TypeScript.
- Utilizar Phaser.
- Mantener las clases pequeñas y con responsabilidades claras.
- Evitar concentrar toda la lógica en GameScene.
- Evitar lógica duplicada y variables globales innecesarias.
- No agregar dependencias externas sin justificar su necesidad.
- Priorizar soluciones comprensibles y respetar la arquitectura existente.

## Flujo de trabajo
Antes de realizar cambios importantes:
1. Analizar el código existente.
2. Explicar brevemente el cambio propuesto.
3. Identificar las clases afectadas.
4. Implementar el cambio, verificar y refactorizar si es necesario.

## Comandos
- Instalar dependencias: npm install
- Ejecutar: npm run dev
- Build: npm run build

