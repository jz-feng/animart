import { GameObjects, Math } from "phaser";
import { Assets } from "../assets";
import { Consts } from "../consts";
import { GameScene } from "../scenes/game_scene";
import { Movable, MoveState } from "./movable";
import { MoveAI } from "./move_ai";

export class NPC extends Movable {
  private moveAI: MoveAI;
  private hasInteracted: boolean = false;

  constructor(
    scene: GameScene,
    location: Math.Vector2,
    moveAI: MoveAI,
    canSee: boolean
  ) {
    super(
      scene,
      scene.add.sprite(location.x, location.y, Assets.NPC, 0),
      "NPC"
    );

    this.moveAI = moveAI;

    this.sprite.setFrame(0);
  }

  public update(): void {
    super.update();

    this.checkCanSeePlayer();
  }

  protected checkCanSeePlayer(): boolean {
    const scene = this.scene as GameScene;
    const dist = Phaser.Math.Distance.BetweenPoints(
      this.sprite.body.position,
      scene.getPlayer().getSprite().body.position
    );
    if (
      !this.hasInteracted &&
      this.moveState === MoveState.Free &&
      scene.getPlayer().getState() === MoveState.Free &&
      dist <= Consts.TILE_SIZE * 2
    ) {
      this.triggerConvo();
      scene.getPlayer().triggerConvo();
      return true;
    } else {
      return false;
    }
  }

  public triggerConvo(): void {
    super.triggerConvo();

    this.hasInteracted = true;
    this.sprite.setTintFill(0xff0000);
  }

  public endConvo(): void {
    super.endConvo();

    this.sprite.setTintFill(0x0000ff);
  }

  protected getMovement(): Phaser.Math.Vector2 {
    return this.moveAI.getMovement();
  }
}
