export default class PlayerController {

  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  shouldSortChildren = true
  boxOpenCallback: () => void

  constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, boxOpenCallback: () => void) {
    this.cursors = cursors
    this.boxOpenCallback = boxOpenCallback
  }


  update(player: Phaser.Physics.Arcade.Sprite) {
    if (!player.active) return
    const speed = 200
    if (this.cursors.left.isDown) {
      player.setVelocity(-speed, 0)
      player.play('left-walk', true)
      this.shouldSortChildren = true
    } else if (this.cursors.right.isDown) {
      player.setVelocity(speed, 0)
      player.play('right-walk', true)
      this.shouldSortChildren = true
    } else if (this.cursors.up.isDown) {
      player.setVelocity(0, -speed)
      player.play('up-walk', true)
      this.shouldSortChildren = true
    } else if (this.cursors.down.isDown) {
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
    const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space)
    if (spaceJustPressed && this.boxOpenCallback) {
      this.boxOpenCallback()
    }
  }

  setChildrenSorted() {
    this.shouldSortChildren = false
  }
}
