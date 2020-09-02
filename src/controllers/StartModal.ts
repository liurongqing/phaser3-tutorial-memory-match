import { TextureKeys } from '~/consts/index'
export default class StartModal {
  panel: Phaser.GameObjects.RenderTexture
  startText: Phaser.GameObjects.Text
  scene: Phaser.Scene
  state: 'idle' | 'entering' | 'exiting'

  get isExiting() {
    return this.state === 'exiting'
  }


  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const { width, height } = scene.scale
    this.panel = scene.add.nineslice(width * 0.5, height * 1.5, 500, 200, TextureKeys.UI_PANEL, 24)
      .setOrigin(0.5)
      .setData('sorted', true)
      .setDepth(10000)

    this.startText = scene.add.text(width * 0.5, height * 1.5, 'Press A to Start', {
      fontSize: 32
    })
    .setColor('#000000')
    .setData('sorted', true)
    .setOrigin(0.5)
      .setDepth(10001)
  }


  init() {
    this.state = 'idle'
  }

  enter() {
    this.state = 'entering'
    this.scene.tweens.add({
      targets: [this.panel, this.startText],
      y: this.scene.scale.height * 0.5,
      duration: 500,
      ease: Phaser.Math.Easing.Bounce.InOut,
      onComplete: () => {
        this.state = 'idle'
      }
    })
  }

  exit(callback: () => void) {
    this.state = 'exiting'
    this.scene.tweens.add({
      targets: [this.panel, this.startText],
      y: this.scene.scale.height * 1.5,
      duration: 300,
      ease: Phaser.Math.Easing.Bounce.InOut,
      onComplete: () => {
        this.state = 'idle'
        callback?.()
      }
    })
  }

  destroy() {
    this.panel.destroy()
    this.startText.destroy()
  }
}
