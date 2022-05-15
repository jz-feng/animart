import { GameObjects, Math } from "phaser";
import { Consts } from "../consts";

export enum MoveState {
  Free,
  Talking,
}

export abstract class Movable extends GameObjects.GameObject {
  protected sprite: GameObjects.Rectangle;
  protected moveState: MoveState = MoveState.Free;

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

  public getState(): MoveState {
    return this.moveState;
  }

  public triggerConvo(): void {
    this.moveState = MoveState.Talking;
  }

  public endConvo(): void {
    this.moveState = MoveState.Free;
  }

  protected move(): void {
    let body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (this.moveState === MoveState.Talking) {
      body.setVelocity(0, 0);
    } else {
      this.currVelocity = this.getMovement();
      body.setVelocity(this.currVelocity.x, this.currVelocity.y);
    }
  }

  protected abstract getMovement(): Phaser.Math.Vector2;
}
