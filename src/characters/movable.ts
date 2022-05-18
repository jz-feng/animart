import { GameObjects, Math, Physics } from "phaser";
import { Consts } from "../consts";
import { GameScene } from "../scenes/game_scene";

export enum MoveState {
  Free,
  Talking,
  Seeking,
}

export abstract class Movable extends GameObjects.Container {
  protected gameScene: GameScene;
  protected sprite: GameObjects.Sprite;
  protected moveState: MoveState = MoveState.Free;
  private currVelocity = new Math.Vector2();

  constructor(
    scene: GameScene,
    sprite: GameObjects.Sprite,
    location: Math.Vector2
  ) {
    super(scene, location.x, location.y, [sprite]);

    scene.add.existing(this);

    this.gameScene = scene;
    this.sprite = sprite.setOrigin(0, 0);

    scene.physics.add.existing(this, false);

    // Only collide lower half of body
    (this.body as Physics.Arcade.Body).setSize(64, 32).setOffset(0, 32);
  }

  public update(): void {
    this.move();
  }

  public getSprite(): GameObjects.Sprite {
    return this.sprite;
  }

  public canMove(): boolean {
    return this.moveState === MoveState.Free;
  }

  public getState(): MoveState {
    return this.moveState;
  }

  public setMoveState(state: MoveState): void {
    this.moveState = state;
  }

  protected move(): void {
    let body = this.body as Phaser.Physics.Arcade.Body;
    if (this.moveState === MoveState.Talking) {
      body.setVelocity(0, 0);
    } else {
      this.currVelocity = this.getMovement();
      body.setVelocity(this.currVelocity.x, this.currVelocity.y);
    }
  }

  protected abstract getMovement(): Phaser.Math.Vector2;

  public abstract triggerConvo(): void;

  public abstract endConvo(): void;
}
