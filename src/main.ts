import 'phaser'

import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'
import scene from '~/scenes/index'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'root',
    width: 700,
    height: 600,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 }
    }
  },
  plugins: {
    global: [
      NineSlicePlugin.DefaultCfg
    ]
  },
  scene,
  input: {
    gamepad: true
  }
}

export default new Phaser.Game(config)
