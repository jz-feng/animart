import { GameObjects, Math } from "phaser";
import { Consts } from "../consts";

export abstract class Movable extends GameObjects.GameObject {
  protected sprite: GameObjects.Rectangle;

  private currVelocity = new Math.Vector2();

  constructor(
    scene: Phaser.Scene,
    sprite: GameObjects.Rectangle,
    type: string
  ) {
    super(scene, type);

    this.sprite = sprite;
    this.sprite.setOrigin(0, 0);

    scene.physics.add.existing(this.sprite, false);
  }

  public update(): void {
    this.move();
  }

  public getSprite(): GameObjects.Rectangle {
    return this.sprite;
  }

  protected move(): void {
    this.currVelocity = this.getMovement();
    if (this.sprite.body instanceof Phaser.Physics.Arcade.Body) {
      this.sprite.body.setVelocity(this.currVelocity.x, this.currVelocity.y);
    }
  }

  protected abstract getMovement(): Phaser.Math.Vector2;
}
