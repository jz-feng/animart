import { Math } from "phaser";
import { Assets } from "../assets";
import { Consts } from "../consts";
import { Movable } from "./movable";

export class Player extends Movable {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private static moveSpeed = 256;

  public static MAX_ENERGY = 100;
  private energy = Player.MAX_ENERGY;

  constructor(scene: Phaser.Scene, location: Math.Vector2) {
    super(
      scene,
      scene.add.sprite(location.x, location.y, Assets.PLAYER, 0),
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
    } else if (this.cursors.down.isDown) {
      direction.y = 1;
    }
    if (this.cursors.left.isDown) {
      direction.x = -1;
    } else if (this.cursors.right.isDown) {
      direction.x = 1;
    }

    let anim_str = "player_idle_";
    if (direction.equals(Math.Vector2.RIGHT)) {
      anim_str += "front_right";
    } else if (direction.equals(Math.Vector2.LEFT)) {
      anim_str += "front_left";
    } else if (direction.x === 1 && direction.y === 1) {
      anim_str += "front_right";
    } else if (direction.x === -1 && direction.y === -1) {
      anim_str += "back_left";
    } else if (direction.y === 1) {
      anim_str += "front_left";
    } else if (direction.y === -1) {
      anim_str += "back_right";
    }

    if (anim_str !== "player_idle_") {
      this.sprite.anims.play(anim_str, true);
    }

    return direction.normalize().scale(Player.moveSpeed);
  }
}
