import { TextureKeys } from '~/consts/index'

enum ModalState {
  IDLE,
  ENTERING,
  EXITING
}
export default class StartModal {
  private scene: Phaser.Scene
  private panel: Phaser.GameObjects.RenderTexture
  private startText: Phaser.GameObjects.Text
  private state = ModalState.IDLE

  get isExiting() {
    return this.state === ModalState.EXITING
  }

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const { width, height } = scene.scale
    this.panel = scene.add.nineslice(width * 0.5, height * 1.5, 500, 200, TextureKeys.UI_PANEL, 24)
      .setOrigin(0.5)
      .setData('sorted', true)
      .setDepth(10000)

    this.startText = scene.add.text(width * 0.5, height * 1.5, 'Press A to Start', {
      fontSize: 32,
      fontFamily: 'Rowdies'
    })
      .setColor('#000000')
      .setData('sorted', true)
      .setOrigin(0.5)
      .setDepth(10001)
  }

  enter() {
    this.state = ModalState.ENTERING

    this.scene.tweens.add({
      targets: [this.panel, this.startText],
      y: this.scene.scale.height * 0.5,
      duration: 500,
      ease: Phaser.Math.Easing.Bounce.InOut,
      onComplete: () => {
        this.state = ModalState.IDLE
      }
    })
  }

  exit(callback: () => void) {
    this.state = ModalState.EXITING
    this.scene.tweens.add({
      targets: [this.panel, this.startText],
      y: this.scene.scale.height * 1.5,
      duration: 300,
      ease: Phaser.Math.Easing.Bounce.InOut,
      onComplete: () => {
        this.state = ModalState.IDLE
        callback?.()
      }
    })
  }

  destroy() {
    this.panel.destroy()
    this.startText.destroy()
  }
}
