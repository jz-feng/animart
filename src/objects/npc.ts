import { Character } from "./character";

export class NPC extends Character {
  constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Rectangle) {
    super(scene, sprite, 5, "NPC");
  }

  public update(): void {
    super.update();
  }

  protected getMovement(): Phaser.Math.Vector2 {
    let direction = new Phaser.Math.Vector2();

    return direction;
  }
}
