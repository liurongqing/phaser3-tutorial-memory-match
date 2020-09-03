import { SceneKeys, TextureKeys } from "~/consts/index";

export default class GameOver extends Phaser.Scene {
  private panel: Phaser.GameObjects.RenderTexture
  private title!: Phaser.GameObjects.Text
  private caption!: Phaser.GameObjects.Text

  constructor() {
    super(SceneKeys.GAME_OVER)
  }
  create(data: { message?: string }) {
    const message = data.message || 'You lose'
    const { width, height } = this.scale

    this.panel = this.add.nineslice(width * 0.5, height * 1.5, 500, 200, TextureKeys.UI_PANEL, 24)
      .setOrigin(0.5)

    this.title = this.add.text(width * 0.5, height * 1.5, message, {
      fontSize: 48,
      color: '#000000'
    })
      .setOrigin(0.5)

    this.caption = this.add.text(width * 0.5, height * 0.5, 'Press a to Play', {
      fontSize: 24,
      color: '#000000'
    })
      .setOrigin(0.5)

    this.tweens.add({
      targets: [this.panel, this.title],
      y: height * 0.55,
      duration: 500,
      ease: Phaser.Math.Easing.Bounce.InOut
    })

    this.tweens.add({
      targets: this.caption,
      y: height * 0.6,
      duration: 500,
      ease: Phaser.Math.Easing.Bounce.InOut
    })
  }
}
