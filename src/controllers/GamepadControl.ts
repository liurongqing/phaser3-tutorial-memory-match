export default class GamepadControl {
  scene: Phaser.Scene
  gamepad: Phaser.Input.Gamepad.Gamepad
  shouldSortChildren = true
  boxOpenCallback: () => void
  constructor(scene: Phaser.Scene, boxOpenCallback: () => void) {
    this.scene = scene
    this.boxOpenCallback = boxOpenCallback

    scene.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, (pad) => {
      this.setGamepad(pad)
    })

    if (scene.input.gamepad.total > 0) {
      this.setGamepad(scene.input.gamepad.pad1)
    }
  }

  update(player: Phaser.Physics.Arcade.Sprite) {
    if (!this.gamepad) return
    const xAxis: number = this.gamepad.axes[0].getValue()
    const yAxis: number = this.gamepad.axes[1].getValue()
    const speed = 200
    if (xAxis <= -1) {
      player.setVelocity(-speed, 0)
      player.play('left-walk', true)
      this.shouldSortChildren = true
    } else if (xAxis >= 1) {
      player.setVelocity(speed, 0)
      player.play('right-walk', true)
      this.shouldSortChildren = true
    } else if (yAxis <= -1) {
      player.setVelocity(0, -speed)
      player.play('up-walk', true)
      this.shouldSortChildren = true
    } else if (yAxis >= 1) {
      player.setVelocity(0, speed)
      player.play('down-walk', true)
      this.shouldSortChildren = true
    } else {
      player.setVelocity(0, 0)
      const key = player.anims.currentAnim.key
      const parts = key.split('-')
      const direction = parts[0]
      player.play(`${direction}-idle`, true)
    }

    if (this.gamepad.B && this.boxOpenCallback) {
      this.boxOpenCallback()
    }
  }

  setGamepad(gamepad: Phaser.Input.Gamepad.Gamepad) {
    this.gamepad = gamepad
  }

  setChildrenSorted() {
    this.shouldSortChildren = false
  }

}
