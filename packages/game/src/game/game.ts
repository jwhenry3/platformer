import Phaser from 'phaser'
import MapScene from './scenes/map.scene'
export default class Game extends Phaser.Game {
  constructor(parentContainer: HTMLElement) {
    super({
      parent: parentContainer,
      type: Phaser.WEBGL,
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: parentContainer,
        width: 1600,
        height: 900,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH
      },
      physics: {
        default: 'matter',
        matter: {
          gravity: { x: 0, y: 2 },
          debug: true
        }
      },
      scene: [MapScene]
    })
  }
}
