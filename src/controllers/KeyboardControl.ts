import { AnimationKeys } from '~/consts/index'

import PlayerControl from './PlayerControl'

export default class KeyboardControl implements PlayerControl {

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private actionCallback?: () => void
  private _shouldSortChildren = true

  get shouldSortChildren() {
    return this._shouldSortChildren
  }

  constructor(scene: Phaser.Scene, actionCallback: () => void) {
    this.cursors = scene.input.keyboard.createCursorKeys()
    this.actionCallback = actionCallback
  }

  update(player: Phaser.Physics.Arcade.Sprite) {
    const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space)

    if (spaceJustPressed && this.actionCallback) {
      this.actionCallback()
    }

    if (!player.active) {
      return
    }
    const speed = 200
    if (this.cursors.left.isDown) {
      player.setVelocity(-speed, 0)
      player.play(AnimationKeys.WALK_LEFT, true)
      this._shouldSortChildren = true
    } else if (this.cursors.right.isDown) {
      player.setVelocity(speed, 0)
      player.play(AnimationKeys.WALK_RIGHT, true)
      this._shouldSortChildren = true
    } else if (this.cursors.up.isDown) {
      player.setVelocity(0, -speed)
      player.play(AnimationKeys.WALK_UP, true)
      this._shouldSortChildren = true
    } else if (this.cursors.down.isDown) {
      player.setVelocity(0, speed)
      player.play(AnimationKeys.WALK_DOWN, true)
      this._shouldSortChildren = true
    } else {
      player.setVelocity(0, 0)
      const key = player.anims.currentAnim?.key
      const parts = key.split('-')
      const direction = parts[1]
      player.play(`idle-${direction}`, true)

    }
  }

  setChildrenSorted() {
    this._shouldSortChildren = false
  }
}
