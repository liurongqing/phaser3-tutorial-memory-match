import PlayerControl from './PlayerControl'

export default class GamepadControl implements PlayerControl {
  private gamepad: Phaser.Input.Gamepad.Gamepad
  private actionCallback: () => void
  private _shouldSortChildren = true

  get shouldSortChildren() {
    return this._shouldSortChildren
  }

  constructor(scene: Phaser.Scene, actionCallback: () => void) {
    this.actionCallback = actionCallback

    scene.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, (pad) => {
      this.setGamepad(pad)
    })

    if (scene.input.gamepad.total > 0) {
      this.setGamepad(scene.input.gamepad.pad1)
    }
  }

  update(player: Phaser.Physics.Arcade.Sprite) {
    if (!this.gamepad) return
    if(!player.active){
      this.handleActionButton()
      return
    }

    const speed = 200
    const xAxis: number = this.gamepad.axes[0].getValue()
    const yAxis: number = this.gamepad.axes[1].getValue()

    if (xAxis <= -1) {
      player.setVelocity(-speed, 0)
      player.play('left-walk', true)
      this._shouldSortChildren = true
    } else if (xAxis >= 1) {
      player.setVelocity(speed, 0)
      player.play('right-walk', true)
      this._shouldSortChildren = true
    } else if (yAxis <= -1) {
      player.setVelocity(0, -speed)
      player.play('up-walk', true)
      this._shouldSortChildren = true
    } else if (yAxis >= 1) {
      player.setVelocity(0, speed)
      player.play('down-walk', true)
      this._shouldSortChildren = true
    } else {
      player.setVelocity(0, 0)
      const key = player.anims.currentAnim.key
      const parts = key.split('-')
      const direction = parts[0]
      player.play(`idle-${direction}`, true)
    }

    this.handleActionButton()
  }

  setGamepad(gamepad: Phaser.Input.Gamepad.Gamepad) {
    this.gamepad = gamepad
  }

  setChildrenSorted() {
    this._shouldSortChildren = false
  }

  handleActionButton() {
    if (!this.gamepad) return
    if (this.gamepad.B && this.actionCallback) {
      this.actionCallback()
    }
  }

}
