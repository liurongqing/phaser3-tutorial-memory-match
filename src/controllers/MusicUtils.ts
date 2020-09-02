export const fadeIn = (scene: Phaser.Scene, music: Phaser.Sound.WebAudioSound, volume: number, duration = 3000) => {
  music.setVolume(0)
  scene.add.tween({
    targets: music,
    volume,
    duration,
    ease: Phaser.Math.Easing.Sine
  })
}

export const fadeOut = (scene: Phaser.Scene, music: Phaser.Sound.WebAudioSound, duration = 3000) => {
  music.setVolume(0)
  scene.add.tween({
    targets: music,
    volume: 0,
    duration,
    ease: Phaser.Math.Easing.Sine
  })
}
