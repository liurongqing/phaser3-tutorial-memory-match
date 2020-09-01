import { Keys } from '~/consts/index'

const level = [
  [1, 0, 3],
  [2, 4, 1],
  [3, 4, 2]
]
export default class Game extends Phaser.Scene {

  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  player!: Phaser.Physics.Arcade.Sprite
  boxGroup!: Phaser.Physics.Arcade.StaticGroup
  activeBox?: Phaser.Physics.Arcade.Sprite
  itemsGroup!: Phaser.GameObjects.Group
  selectedBoxes = []
  matchesCount: number

  constructor() {
    super(Keys.GameScene)
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.matchesCount = 0
  }

  create() {
    const { width, height } = this.scale
    this.player = this.physics.add.sprite(width * 0.5, height * 0.63, 'sokoban')
      .setSize(40, 16)
      .setOffset(12, 38)
      .play('down-idle')


    this.boxGroup = this.physics.add.staticGroup()
    this.createdBoxes()
    this.physics.add.collider(
      this.boxGroup,
      this.player,
      this.handlePlayerBoxCollide,
      undefined,
      this)

    this.itemsGroup = this.add.group()
  }

  update() {
    this.updatePlayer()

    this.updateActiveBox()

    this.children.each(c => {
      const child = c as Phaser.Physics.Arcade.Sprite
      if (child.getData('sorted')) return
      child.setDepth(child.y)
    })
  }

  createdBoxes() {
    const width = this.scale.width
    let xPer = 0.25
    let y = 150
    for (let row = 0; row < level.length; ++row) {
      for (let col = 0; col < level[row].length; ++col) {
        const box = this.boxGroup.get(width * xPer, y, 'sokoban', 10)
        box.setSize(64, 32)
          .setOffset(0, 32)
          .setData('itemType', level[row][col])
        xPer += 0.25
      }
      xPer = 0.25
      y += 150
    }
  }

  handlePlayerBoxCollide(player: Phaser.Physics.Arcade.Sprite, box: Phaser.Physics.Arcade.Sprite) {
    const opened = box.getData('opened')
    if (opened) return
    if (this.activeBox) return
    this.activeBox = box
    this.activeBox.setFrame(9)
  }

  updatePlayer() {
    if (!this.player.active) return
    const speed = 200
    if (this.cursors.left.isDown) {
      this.player.setVelocity(-speed, 0)
      this.player.play('left-walk', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocity(speed, 0)
      this.player.play('right-walk', true)
    } else if (this.cursors.up.isDown) {
      this.player.setVelocity(0, -speed)
      this.player.play('up-walk', true)
    } else if (this.cursors.down.isDown) {
      this.player.setVelocity(0, speed)
      this.player.play('down-walk', true)
    } else {
      this.player.setVelocity(0, 0)
      const key = this.player.anims.currentAnim.key
      const parts = key.split('-')
      const direction = parts[0]
      this.player.play(`${direction}-idle`, true)
    }
    const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space)
    if (spaceJustPressed && this.activeBox) {
      this.openBox(this.activeBox)
      this.activeBox.setFrame(10)
      this.activeBox = undefined
    }
  }

  updateActiveBox() {
    if (!this.activeBox) return
    const distance = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.activeBox.x, this.activeBox.y
    )
    if (distance < 64) return
    this.activeBox.setFrame(10)
    this.activeBox = undefined
  }

  openBox(box: Phaser.Physics.Arcade.Sprite) {
    if (!box) return
    const itemType = box.getData('itemType')
    let item: Phaser.GameObjects.Sprite
    switch (itemType) {
      case 0:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture('bear')
        break;
      case 1:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture('chicken')
        break;
      case 2:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture('duck')
        break;
      case 3:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture('parrot')
        break;
      case 4:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture('penguin')
        break;
    }
    box.setData('opened', true)
    item.setData('sorted', true)
    item.setDepth(2000)

    item.setActive(true)
    item.setVisible(true)

    item.setScale(0)
    item.setAlpha(0)

    this.selectedBoxes.push({
      box,
      item
    })

    this.tweens.add({
      targets: item,
      y: '-=50',
      alpha: 1,
      scale: 1,
      duration: 500,
      onComplete: () => {
        if (itemType === 0) {
          this.handleBearSelected()
          return
        }
        if (this.selectedBoxes.length < 2) return
        this.checkForMatch()
      }
    })

  }

  checkForMatch() {
    const second = this.selectedBoxes.pop()
    const first = this.selectedBoxes.pop()
    if (first.item.texture !== second.item.texture) {
      this.tweens.add({
        targets: [first.item, second.item],
        y: '+=50',
        alpha: 0,
        scale: 0,
        duration: 300,
        delay: 1000,
        onComplete: () => {
          this.itemsGroup.killAndHide(first.item)
          this.itemsGroup.killAndHide(second.item)

          first.box.setData('opened', false)
          second.box.setData('opened', false)
        }
      })
      return
    }

    ++this.matchesCount
    this.time.delayedCall(1000, () => {
      first.box.setFrame(8)
      second.box.setFrame(8)

      if (this.matchesCount >= 4) {
        this.player.active = false
        this.player.setVelocity(0, 0)

        const { width, height } = this.scale
        this.add.text(width * 0.5, height * 0.5, 'You Win!', {
          fontSize: 48
        })
          .setOrigin(0.5)
      }
    })
  }

  handleBearSelected() {
    const { box, item } = this.selectedBoxes.pop()
    item.setTint(0xff0000)
    box.setFrame(7)

    this.player.active = false
    this.player.setVelocity(0, 0)

    this.time.delayedCall(1000, () => {
      item.setTint(0xffffff)
      box.setFrame(10)
      box.setData('opened', false)

      this.tweens.add({
        targets: item,
        y: '+=50',
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () => {
          this.player.active = true
        }
      })
    })
  }

}
