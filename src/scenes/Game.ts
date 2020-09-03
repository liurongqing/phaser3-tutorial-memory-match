import { SceneKeys, TextureKeys, SoundKeys } from '~/consts/index'
import CountdownControl from '~/controllers/CountdownControl'
import PlayerControl from "~/controllers/PlayerControl";
// import GamepadControl from "~/controllers/GamepadControl";
import StartModal from '~/controllers/StartModal'
import { fadeIn, fadeOut } from '~/controllers/MusicUtils'

const level = [
  [1, 0, 3],
  [2, 4, 1],
  [3, 4, 2]
]
export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private player!: Phaser.Physics.Arcade.Sprite
  private boxGroup!: Phaser.Physics.Arcade.StaticGroup
  private activeBox?: Phaser.Physics.Arcade.Sprite
  private itemsGroup!: Phaser.GameObjects.Group
  private selectedBoxes = []
  private matchesCount: number
  private countdown: any
  private control: any
  private startModal?: any
  private music: Phaser.Sound.WebAudioSound

  constructor() {
    super(SceneKeys.GAME)
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.matchesCount = 0

    this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, (pad) => {
      if (!this.control || !this.control.setGamepad) return
      this.control.setGamepad(pad)
    })

    this.music = this.sound.add(SoundKeys.MUSIC, {
      loop: true,
      volume: 0.1
    }) as any


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

    this.countdown = new CountdownControl(this, timerLabel)


    this.control = new PlayerControl(
      this.cursors,
      this.handlePlayerOpenActiveBox.bind(this)
    )
    // this.control = new GamepadControl(this.handlePlayerOpenActiveBox.bind(this))

    this.startModal = new StartModal(this)
    this.startModal.enter()

  }

  update() {
    this.control.update(this.player)
    this.updateActiveBox()

    if (this.control.shouldSortChildren) {
      this.children.each(c => {
        const child = c as Phaser.Physics.Arcade.Sprite
        if (child.getData('sorted')) return
        child.setDepth(child.y)
      })
      this.control.setChildrenSorted()
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
    // console.log('openbox', this.startModal, this.scene.isActive(SceneKeys.GAME_OVER))
    if (this.activeBox) {
      this.openBox(this.activeBox)
    } else if (this.startModal && !this.startModal.isExting) {
      this.startModal.exit(() => {
        this.countdown.start(this.handleCountdownFinished.bind(this), 45000)

        this.music.play()
        fadeIn(this, this.music, 0.1, 2000)

        // console.log('this.startModal', this.startModal)
        this.startModal?.destroy()
        this.startModal = undefined
      })
    } else if (this.scene.isActive(SceneKeys.GAME_OVER)) {
      console.log('scenekeys', SceneKeys.GAME_OVER)
      this.scene.stop(SceneKeys.GAME_OVER)
      this.scene.restart()
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

    if (!item) return
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
    this.sound.play(SoundKeys.SFX_BOX_SELECT, {
      volume: 0.8
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

    if (this.activeBox) {
      this.activeBox.setFrame(10)
      this.activeBox = undefined
    }

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
      this.sound.play(SoundKeys.SFX_MATCH, {
        volume: 0.8
      })

      this.time.delayedCall(1000, () => {
        if (this.matchesCount >= 4) {
          fadeOut(this, this.music, 2000)
          this.sound.play(SoundKeys.SFX_VICTORY, {
            volume: 0.8
          })
          this.countdown.stop()

          this.player.active = false
          this.player.setVelocity(0, 0)

          this.scene.run(SceneKeys.GAME_OVER, {
            message: 'You Win!'
          })
        }
      })
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
    fadeOut(this, this.music, 2000)
    this.sound.play(SoundKeys.SFX_GAMEOVER, {
      volume: 0.8
    })

    this.player.active = false
    this.player.setVelocity(0, 0)
    this.scene.run(SceneKeys.GAME_OVER, {
      message: 'You lose!'
    })
  }

}
