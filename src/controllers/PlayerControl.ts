interface PlayerControl {
  readonly shouldSortChildren: boolean
  setGamepad?(gamepad: Phaser.Input.Gamepad.Gamepad): void
  update(player: Phaser.Physics.Arcade.Sprite): void
  setChildrenSorted(): void
}

export default PlayerControl
