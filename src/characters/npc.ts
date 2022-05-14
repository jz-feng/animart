import { Movable } from "./movable";
import { MoveAI } from "./move_ai";

export class NPC extends Movable {
  private moveAI: MoveAI;

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.GameObjects.Rectangle,
    moveAI: MoveAI
  ) {
    super(scene, sprite, "NPC");

    this.moveAI = moveAI;
  }

  public update(): void {
    super.update();
  }

  protected getMovement(): Phaser.Math.Vector2 {
    return this.moveAI.getMovement();
  }
}
