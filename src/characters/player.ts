import { Math } from "phaser";
import { Assets } from "../assets";
import { Consts } from "../consts";
import { Movable } from "./movable";

export class Player extends Movable {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private static moveSpeed = 256;

  public static MAX_ENERGY = 100;
  private energy = Player.MAX_ENERGY;

  constructor(scene: Phaser.Scene) {
    super(
      scene,
      scene.add.sprite(
        Consts.GAME_WIDTH / 2,
        Consts.GAME_HEIGHT / 2,
        Assets.PLAYER,
        0
      ),
      "player"
    );

    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  public update(): void {
    super.update();
  }

  public getEnergy(): number {
    return this.energy;
  }

  public endConvo(): void {
    super.endConvo();

    this.energy -= 10;
  }

  protected getMovement(): Math.Vector2 {
    let direction = new Math.Vector2();
    if (this.cursors.up.isDown) {
      direction.y = -1;
      this.sprite.setFrame(1);
    } else if (this.cursors.down.isDown) {
      direction.y = 1;
      this.sprite.setFrame(0);
    }
    if (this.cursors.left.isDown) {
      direction.x = -1;
    } else if (this.cursors.right.isDown) {
      direction.x = 1;
    }
    return direction.scale(Player.moveSpeed);
  }
}
