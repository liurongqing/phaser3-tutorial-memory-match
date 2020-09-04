import * as WebFontLoader from 'webfontloader'

export default class WebFontFile extends Phaser.Loader.File {
  fontNames: string[]
  service: string
  fontsLoadedCount: number
  constructor(loader: Phaser.Loader.LoaderPlugin, fontNames: string | string[], service = 'google') {
    super(loader, {
      type: 'webfont',
      key: fontNames.toString()
    })
    this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames]
    this.service = service

    this.fontsLoadedCount = 0
  }
  load() {
    const config = {
      fontactive: (familyName: string) => {
        this.checkLoadedFonts(familyName)
      },
      fontinactive: (familyName: string) => {
        this.checkLoadedFonts(familyName)
      }
    }

    switch (this.service) {
      case 'google':
        config['google'] = this.getGoogleConfig()
        break;
      case 'adobe-edge':
        config['typekit'] = this.getAdobeEdgeConfig()
        break
      default:
        throw new Error('Unsupported font service')
    }

    WebFontLoader.load(config)
  }

  getGoogleConfig() {
    return {
      families: this.fontNames
    }
  }

  getAdobeEdgeConfig() {
    return {
      id: this.fontNames.join(';'),
      api: '//use.edgefonts.net'
    }
  }

  checkLoadedFonts(familyName: string) {
    if (this.fontNames.indexOf(familyName) < 0) {
      return
    }
    ++this.fontsLoadedCount
    if (this.fontsLoadedCount >= this.fontNames.length) {
      this.loader.nextFile(this, true)
    }
  }
}
