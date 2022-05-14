import { Consts } from "../consts";

export abstract class Character extends Phaser.GameObjects.GameObject {
  public sprite: Phaser.GameObjects.Rectangle;

  private moveSpeed: number;

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Rectangle,
    moveSpeed: number,
    type: string
  ) {
    super(scene, type);

    this.sprite = sprite;
    this.moveSpeed = moveSpeed;
  }

  public update(): void {
    this.move();
  }

  protected move(): void {
    let direction = this.getMovement();
    this.sprite.x += direction.x * this.moveSpeed;
    this.sprite.y += direction.y * this.moveSpeed;
  }

  protected abstract getMovement(): Phaser.Math.Vector2;
}
