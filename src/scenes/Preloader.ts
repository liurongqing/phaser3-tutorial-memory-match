import { SceneKeys, TextureKeys, SoundKeys } from "~/consts/index";

export default class Preloader extends Phaser.Scene {

  constructor() {
    super(SceneKeys.PRELOADER)
  }

  preload() {
    this.load.spritesheet('sokoban', 'assets/textures/sokoban_tilesheet.png', {
      frameWidth: 64
    })
    this.load.image(TextureKeys.BEAR, 'assets/textures/bear.png')
    this.load.image(TextureKeys.CHICKEN, 'assets/textures/chicken.png')
    this.load.image(TextureKeys.DUCK, 'assets/textures/duck.png')
    this.load.image(TextureKeys.PARROT, 'assets/textures/parrot.png')
    this.load.image(TextureKeys.PENGUIN, 'assets/textures/penguin.png')

    this.load.audio(SoundKeys.MUSIC, 'assets/music/8Bit-Mini-Gamer-Loop.wav')
    this.load.audio(SoundKeys.SFX_BOX_SELECT, 'assets/sfx/Pickup-Soft.wav')
    this.load.audio(SoundKeys.SFX_GAMEOVER, 'assets/sfx/GameOver.wav')
    this.load.audio(SoundKeys.SFX_MATCH, 'assets/sfx/Ice-Reflect.wav')
    this.load.audio(SoundKeys.SFX_VICTORY, 'assets/sfx/Victory-SoundFX1.wav')

  }

  create() {
    this.anims.create({
      key: 'down-idle',
      frames: [{ key: TextureKeys.SOKOBAN, frame: 52 }]
    })

    this.anims.create({
      key: 'up-idle',
      frames: [{ key: TextureKeys.SOKOBAN, frame: 55 }]
    })

    this.anims.create({
      key: 'left-idle',
      frames: [{ key: TextureKeys.SOKOBAN, frame: 81 }]
    })

    this.anims.create({
      key: 'right-idle',
      frames: [{ key: TextureKeys.SOKOBAN, frame: 78 }]
    })

    this.anims.create({
      key: 'down-walk',
      frames: this.anims.generateFrameNumbers('sokoban', {
        start: 52, end: 54
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'up-walk',
      frames: this.anims.generateFrameNumbers('sokoban', {
        start: 55, end: 57
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'left-walk',
      frames: this.anims.generateFrameNumbers('sokoban', {
        start: 81, end: 83
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'right-walk',
      frames: this.anims.generateFrameNumbers('sokoban', {
        start: 78, end: 80
      }),
      frameRate: 10,
      repeat: -1
    })

    this.scene.start(SceneKeys.GAME)
  }
}
