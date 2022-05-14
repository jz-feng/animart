import { Consts } from "../consts";
import { Character } from "./character";

export class Player extends Character {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene) {
    super(
      scene,
      scene.add.rectangle(
        Consts.GAME_WIDTH / 2,
        Consts.GAME_HEIGHT / 2,
        Consts.TILE_SIZE,
        Consts.TILE_SIZE,
        0x000000
      ),
      10,
      "player"
    );

    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  public update(): void {
    super.update();
  }

  protected getMovement(): Phaser.Math.Vector2 {
    let direction = new Phaser.Math.Vector2();
    if (this.cursors.up.isDown) {
      direction.y = -1;
    } else if (this.cursors.down.isDown) {
      direction.y = 1;
    }
    if (this.cursors.left.isDown) {
      direction.x = -1;
    } else if (this.cursors.right.isDown) {
      direction.x = 1;
    }
    direction.normalize();
    return direction;
  }
}
