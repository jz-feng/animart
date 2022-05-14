import { Math } from "phaser";
import { Consts } from "../consts";

export abstract class Movable extends Phaser.GameObjects.GameObject {
  public sprite: Phaser.GameObjects.Rectangle;

  private velocity = new Math.Vector2();

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Rectangle,
    type: string
  ) {
    super(scene, type);

    this.sprite = sprite;
    this.sprite.setOrigin(0, 0);
  }

  public update(): void {
    this.move();
  }

  protected move(): void {
    if (
      this.sprite.x % Consts.TILE_SIZE === 0 &&
      this.sprite.y % Consts.TILE_SIZE === 0
    ) {
      this.velocity = this.getMovement();
    }
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
  }

  protected abstract getMovement(): Phaser.Math.Vector2;
}
