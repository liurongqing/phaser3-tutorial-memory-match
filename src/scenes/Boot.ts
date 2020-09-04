import { SceneKeys } from '~/consts/index'
import WebFontLoader from '~/controllers/WebFontFile'

export default class Boot extends Phaser.Scene {
  constructor() {
    super(SceneKeys.BOOT)
  }

  preload() {
    const fonts = new WebFontLoader(this.load, [
      'Rowdies',
      'PT Sans'
    ])
    this.load.addFile(fonts)
  }

  create() {
    this.scene.start(SceneKeys.PRELOADER)
  }

}
