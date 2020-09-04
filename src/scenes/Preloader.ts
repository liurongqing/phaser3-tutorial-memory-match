import { AnimationKeys, SceneKeys, SoundKeys, TextureKeys } from '~/consts/index'

export default class Preloader extends Phaser.Scene {

  constructor() {
    super(SceneKeys.PRELOADER)
  }

  init() {
    this.scene.run(SceneKeys.LOADING)
  }

  preload() {
    this.load.spritesheet(TextureKeys.SOKOBAN, 'assets/textures/sokoban_tilesheet.png', {
      frameWidth: 64
    })
    this.load.image(TextureKeys.BEAR, 'assets/textures/bear.png')
    this.load.image(TextureKeys.CHICKEN, 'assets/textures/chicken.png')
    this.load.image(TextureKeys.DUCK, 'assets/textures/duck.png')
    this.load.image(TextureKeys.PARROT, 'assets/textures/parrot.png')
    this.load.image(TextureKeys.PENGUIN, 'assets/textures/penguin.png')

    this.load.image(TextureKeys.UI_PANEL, 'assets/textures/grey_panel.png')
    this.load.bitmapFont(TextureKeys.FONT_NUMBERS, 'assets/textures/mario-numbers.png', 'assets/textures/mario-numbers.fnt')

    this.load.audio(SoundKeys.MUSIC, 'assets/music/8Bit-Mini-Gamer-Loop.wav')
    this.load.audio(SoundKeys.SFX_BOX_SELECT, 'assets/sfx/Pickup-Soft.wav')
    this.load.audio(SoundKeys.SFX_GAMEOVER, 'assets/sfx/GameOver.wav')
    this.load.audio(SoundKeys.SFX_MATCH, 'assets/sfx/Ice-Reflect.wav')
    this.load.audio(SoundKeys.SFX_VICTORY, 'assets/sfx/Victory-SoundFX1.wav')

  }

  create() {
    this.anims.create({
      key: AnimationKeys.IDLE_DOWN,
      frames: [{ key: TextureKeys.SOKOBAN, frame: 52 }]
    })

    this.anims.create({
      key: AnimationKeys.IDLE_UP,
      frames: [{ key: TextureKeys.SOKOBAN, frame: 55 }]
    })

    this.anims.create({
      key: AnimationKeys.IDLE_LEFT,
      frames: [{ key: TextureKeys.SOKOBAN, frame: 81 }]
    })

    this.anims.create({
      key: AnimationKeys.IDLE_RIGHT,
      frames: [{ key: TextureKeys.SOKOBAN, frame: 78 }]
    })

    this.anims.create({
      key: AnimationKeys.WALK_DOWN,
      frames: this.anims.generateFrameNumbers(TextureKeys.SOKOBAN, {
        start: 52, end: 54
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: AnimationKeys.WALK_UP,
      frames: this.anims.generateFrameNumbers(TextureKeys.SOKOBAN, {
        start: 55, end: 57
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: AnimationKeys.WALK_LEFT,
      frames: this.anims.generateFrameNumbers(TextureKeys.SOKOBAN, {
        start: 81, end: 83
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: AnimationKeys.WALK_RIGHT,
      frames: this.anims.generateFrameNumbers(TextureKeys.SOKOBAN, {
        start: 78, end: 80
      }),
      frameRate: 10,
      repeat: -1
    })

    this.scene.stop(SceneKeys.LOADING)
    this.scene.start(SceneKeys.GAME)
  }
}
