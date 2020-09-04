export default class CountdownController {
  scene: Phaser.Scene
  label: Phaser.GameObjects.BitmapText
  timerEvent: Phaser.Time.TimerEvent
  duration = 0

  constructor(scene: Phaser.Scene, label: Phaser.GameObjects.BitmapText) {
    this.scene = scene
    this.label = label
  }

  start(callback: Function, duration = 50000) {
    this.stop()
    this.duration = duration
    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
      callback: () => {
        this.label.text = '0'
        this.stop()
        callback?.()
      }
    })
  }

  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy()
      this.timerEvent = undefined
    }
  }

  update() {
    if (!this.timerEvent || this.duration <= 0) return
    const elapsed = this.timerEvent.getElapsed()
    const remaining = this.duration - elapsed
    const seconds = remaining / 1000
    this.label.text = seconds.toFixed(2)
  }
}
