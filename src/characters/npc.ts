import { GameObjects, Math, Sound } from "phaser";
import { Assets } from "../assets";
import { Consts } from "../consts";
import { GameScene } from "../scenes/game_scene";
import { Movable, MoveState } from "./movable";
import { MoveAI } from "./move_ai";

export class NPC extends Movable {
  private moveAI: MoveAI;
  private hasInteracted: boolean = false;
  private alert: GameObjects.Text;

  // sound
  private spottedSound: Sound.BaseSound;

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

    this.alert = scene.add
      .text(0, 0, "!", {
        color: "#ff8888",
        fontFamily: Consts.FONT,
        fontSize: "48px",
        // stroke: "#444444",
        // strokeThickness: 5,
      })
      .setOrigin(0, 0)
      .setVisible(false)
      .setDepth(10);

    // scene.add.tween({
    //   targets: this.alert,
    //   y: 0,
    //   ease: "Linear",
    //   yoyo: true,
    //   repeat: -1,
    // });

    // sound
    this.spottedSound = scene.sound.add("spotted");
  }

  public update(): void {
    super.update();

    // Dumb way to follow the sprite
    this.alert.setPosition(
      this.sprite.body.position.x - 32,
      this.sprite.body.position.y - 64
    );

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
    this.moveState = MoveState.Seeking;
    this.hasInteracted = true;
    this.spottedSound.play();
    this.alert.setVisible(true);
  }

  public endConvo(): void {
    super.endConvo();

    this.alert.setVisible(false);
    this.sprite.setTintFill(0x0000ff);
  }

  protected getMovement(): Phaser.Math.Vector2 {
    if (this.moveState === MoveState.Seeking) {
      return this.getMovementTowardPlayer();
    }
    return this.moveAI.getMovement();
  }

  protected getMovementTowardPlayer(): Math.Vector2 {
    let player_pos = (
      (this.scene as GameScene).getPlayer().getSprite().body
        .position as Math.Vector2
    ).clone();
    if (
      Math.Distance.BetweenPoints(player_pos, this.sprite.body.position) <=
      Consts.TILE_SIZE
    ) {
      this.moveState = MoveState.Talking;
      return Math.Vector2.ZERO;
    } else {
      return player_pos
        .subtract(this.sprite.body.position)
        .normalize()
        .scale(256);
    }
  }
}
