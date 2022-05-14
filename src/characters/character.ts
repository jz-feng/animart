import { Consts } from "../consts";

export abstract class Character extends Phaser.GameObjects.GameObject {
  public sprite: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Rectangle,
    type: string
  ) {
    super(scene, type);

    this.sprite = sprite;
  }

  public update(): void {
    this.move();
  }

  protected move(): void {
    let velocity = this.getMovement();
    this.sprite.x += velocity.x;
    this.sprite.y += velocity.y;
  }

  protected abstract getMovement(): Phaser.Math.Vector2;
}
