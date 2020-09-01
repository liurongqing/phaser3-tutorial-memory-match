import { SceneKeys, TextureKeys } from '~/consts/index'
import CountdownController from '~/controllers/CountdownController'
import PlayerController from "~/controllers/PlayerController";

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
  countdown: any
  control: any
  shouldSortChildren = true

  constructor() {
    super(SceneKeys.GAME)
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.matchesCount = 0
  }

  create() {
    const { width, height } = this.scale
    this.player = this.physics.add.sprite(width * 0.5, height * 0.63, TextureKeys.SOKOBAN)
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

    const timerLabel = this.add.text(width * 0.5, 50, '', {
      fontSize: 48
    })
      .setOrigin(0.5)

    this.countdown = new CountdownController(this, timerLabel)
    this.countdown.start(this.handleCountdownFinished.bind(this), 10000)

    this.control = new PlayerController(this.handlePlayerOpenActiveBox.bind(this))
  }

  update() {
    this.control.update(this.cursors, this.player)
    this.updateActiveBox()

    if (this.shouldSortChildren) {
      this.children.each(c => {
        const child = c as Phaser.Physics.Arcade.Sprite
        if (child.getData('sorted')) return
        child.setDepth(child.y)
      })
      this.shouldSortChildren = false
    }

    this.countdown.update()
  }

  createdBoxes() {
    const width = this.scale.width
    let xPer = 0.25
    let y = 150
    for (let row = 0; row < level.length; ++row) {
      for (let col = 0; col < level[row].length; ++col) {
        const box = this.boxGroup.get(width * xPer, y, TextureKeys.SOKOBAN, 10)
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

  handlePlayerOpenActiveBox() {
    this.openBox(this.activeBox)
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
        item.setTexture(TextureKeys.BEAR)
        break;
      case 1:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.CHICKEN)
        break;
      case 2:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.DUCK)
        break;
      case 3:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.PARROT)
        break;
      case 4:
        item = this.itemsGroup.get(box.x, box.y)
        item.setTexture(TextureKeys.PENGUIN)
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

        this.countdown.stop()

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

  handleCountdownFinished() {
    const { width, height } = this.scale
    this.player.active = false
    this.player.setVelocity(0, 0)

    this.add.text(width * 0.5, height * 0.5, 'You Lose', {
      fontSize: 48
    })
      .setOrigin(0.5)
  }

}
