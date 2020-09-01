export default class PlayerController {
  shouldSortChildren: true
  boxOpenCallback: () => void

  constructor(boxOpenCallback: () => void) {
    this.boxOpenCallback = boxOpenCallback
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Phaser.Physics.Arcade.Sprite) {
    if (!player.active) return
    const speed = 200
    if (cursors.left.isDown) {
      player.setVelocity(-speed, 0)
      player.play('left-walk', true)
      this.shouldSortChildren = true
    } else if (cursors.right.isDown) {
      player.setVelocity(speed, 0)
      player.play('right-walk', true)
      this.shouldSortChildren = true
    } else if (cursors.up.isDown) {
      player.setVelocity(0, -speed)
      player.play('up-walk', true)
      this.shouldSortChildren = true
    } else if (cursors.down.isDown) {
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
    const spaceJustPressed = Phaser.Input.Keyboard.JustUp(cursors.space)
    if (spaceJustPressed && this.boxOpenCallback) {
      this.boxOpenCallback()
    }
  }
}
