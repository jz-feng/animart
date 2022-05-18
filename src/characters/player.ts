import { Math, Sound } from "phaser";
import { Assets } from "../assets";
import { GameScene } from "../scenes/game_scene";
import { Movable, MoveState } from "./movable";

export class Player extends Movable {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private static moveSpeed = 200;

  private lastDirection = Math.Vector2.ZERO;

  public static MAX_ENERGY = 100;
  private energy = Player.MAX_ENERGY;

  constructor(scene: GameScene, location: Math.Vector2) {
    super(scene, scene.add.sprite(0, 0, Assets.PLAYER, 0), location);

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  public getEnergy(): number {
    return this.energy;
  }

  public triggerConvo(): void {
    this.moveState = MoveState.Talking;
  }

  public endConvo(): void {
    this.moveState = MoveState.Free;

    this.energy -= 10;
    this.gameScene.sound.get("energyLost").play();

    if (this.energy <= 0) {
      // this.gameOverSound.play();
      // this.emit("game_over");
    }
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

    let anim_str = "player_";
    if (direction.equals(Math.Vector2.ZERO)) {
      anim_str += "idle_";
    } else {
      this.lastDirection = direction.clone();
      anim_str += "walk_";
    }

    if (this.lastDirection.equals(Math.Vector2.RIGHT)) {
      anim_str += "front_right";
    } else if (this.lastDirection.equals(Math.Vector2.LEFT)) {
      anim_str += "front_left";
    } else if (this.lastDirection.x === 1 && this.lastDirection.y === 1) {
      anim_str += "front_right";
    } else if (this.lastDirection.x === -1 && this.lastDirection.y === -1) {
      anim_str += "back_left";
    } else if (this.lastDirection.y === 1) {
      anim_str += "front_left";
    } else if (this.lastDirection.y === -1) {
      anim_str += "back_right";
    }

    // lol
    if (anim_str.length > 12) {
      this.sprite.anims.play(anim_str, true);
    }

    return direction.normalize().scale(Player.moveSpeed);
  }
}
