import { SceneKeys } from '~/consts/index'
export default class Loading extends Phaser.Scene {
  constructor() {
    super(SceneKeys.LOADING)
  }

  create() {
    const { width, height } = this.scale

    const left = this.add.circle(width * 0.45, height * 0.5, 8, 0xffffff, 1)
    const middle = this.add.circle(width * 0.5, height * 0.5, 8, 0xffffff, 1)
    const right = this.add.circle(width * 0.55, height * 0.5, 8, 0xffffff, 1)

    const loadingText = this.add.text(width * 0.5, height * 0.55, 'Loading', {
      fontSize: 32,
      fontFamily: 'Rowdies'
    })
      .setOrigin(0.5)

    this.tweens.add({
      targets: [left, middle, right],
      y: '-=20',
      duration: 300,
      repeat: -1,
      yoyo: true,
      ease: Phaser.Math.Easing.Bounce.InOut,
      repeatDelay: 500,
      delay: this.tweens.stagger(150, {})
    })

    this.tweens.add({
      targets: loadingText,
      alpha: 0.3,
      repeat: -1,
      yoyo: true,
      duration: 3000,
      ease: Phaser.Math.Easing.Circular.InOut
    })
  }
}
