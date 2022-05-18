import { GameObjects, LEFT, Math, Sound, Time } from "phaser";
import { Assets } from "../assets";
import { Consts } from "../consts";
import { GameScene } from "../scenes/game_scene";
import { Utils } from "../utils";
import { Movable, MoveState } from "./movable";
import { MoveAI } from "./move_ai";

export class NPC extends Movable {
  private moveAI: MoveAI;
  private hasInteracted: boolean = false;
  private alert: GameObjects.Sprite;
  private cooldown: Time.TimerEvent;
  private cooldownDuration: number;

  private dialogBox: GameObjects.Rectangle;
  private dialogText: GameObjects.Text;
  private dialogSentences: string[];
  private currSetenceIndex = 1;

  private lastDirection = Math.Vector2.ZERO;

  // sound
  private spottedSound: Sound.BaseSound;
  private speechSounds: Sound.BaseSound[] = [];

  private rnd: Math.RandomDataGenerator;

  constructor(
    scene: GameScene,
    location: Math.Vector2,
    moveAI: MoveAI,
    dialogText: string[],
    voice: string,
    cooldown: number = 5
  ) {
    super(scene, scene.add.sprite(0, 0, Assets.NPC, 0), location);

    this.rnd = new Math.RandomDataGenerator();

    this.moveAI = moveAI;

    this.alert = scene.add
      .sprite(-32, 0, "objects_sprite", 53)
      .setOrigin(0, 0)
      .setVisible(false)
      .setDepth(Consts.Layers.Overlay);

    this.cooldown = scene.time.addEvent({
      paused: true,
    });
    this.cooldownDuration = cooldown;

    // sound
    this.spottedSound = scene.sound.add("spotted");
    for (let i = 1; i < 6; i++) {
      this.speechSounds.push(scene.sound.add(voice + "_" + i));
    }

    this.dialogBox = scene.add
      .rectangle(0, 0, Consts.TILE * 7, Consts.TILE * 3, 0xffffff)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x888888)
      .setVisible(false)
      .setDepth(Consts.Layers.Dialog);

    this.dialogText = scene.add
      .text(0, 0, "", {
        color: "#888888",
        fontFamily: Consts.FONT,
        fontSize: "24px",
        align: "left",
        wordWrap: {
          width: Consts.TILE * 7 - 32,
          useAdvancedWrap: true,
        },
      })
      .setOrigin(0, 0)
      .setVisible(false)
      .setDepth(Consts.Layers.Dialog);

    // Do not add dialog components to this container since they need to be
    // on their own layer
    this.add([this.alert]);

    this.dialogSentences = dialogText;

    this.sprite.play("npc_idle_front");
  }

  public update(): void {
    super.update();

    this.checkRenderDepth();
    this.checkCanSeePlayer();
  }

  protected checkCanSeePlayer(): boolean {
    const player = this.gameScene.getPlayer();
    const dist = Phaser.Math.Distance.BetweenPoints(
      this.body.position,
      player.body.position
    );
    if (
      (this.cooldown.paused || this.cooldown.getRemaining() === 0) &&
      this.canMove() &&
      player.canMove() &&
      dist <= Consts.TILE * 2
    ) {
      this.triggerConvo();
      player.triggerConvo();
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

    // Always play the first voiceline at the start
    this.speechSounds.at(0).play();
  }

  public continueConvo(): void {
    if (this.currSetenceIndex < this.dialogSentences.length) {
      this.currSetenceIndex++;
      this.updateDialogText();

      // After the first line, play random lines
      this.rnd.pick(this.speechSounds.slice(1)).play();
    } else {
      this.endConvo();
    }
  }

  private updateDialogText(): void {
    this.dialogText.setText(
      this.dialogSentences
        .slice(0, this.currSetenceIndex)
        .reduce((a, b) => a + b)
    );
  }

  public endConvo(): void {
    this.moveState = MoveState.Free;
    this.gameScene.triggerEndConvo();
    this.cooldown = this.scene.time.addEvent({
      delay: this.cooldownDuration * 1000,
    });
    this.alert.setVisible(false);
    this.hideDialog();
  }

  protected getMovement(): Phaser.Math.Vector2 {
    let movement: Math.Vector2;
    if (this.moveState === MoveState.Seeking) {
      movement = this.getMovementTowardPlayer();
    } else {
      movement = this.moveAI.getMovement();
    }

    let anim_str = "npc_";
    if (movement.equals(Math.Vector2.ZERO)) {
      anim_str += "idle_";
    } else {
      this.lastDirection = movement.clone();
      anim_str += "walk_";
    }

    if (this.lastDirection.y > 0) {
      anim_str += "front";
    } else if (this.lastDirection.y < 0) {
      anim_str += "back";
    }

    // lol
    if (anim_str.length > 12) {
      this.sprite.anims.play(anim_str, true);
    }
    return movement;
  }

  protected getMovementTowardPlayer(): Math.Vector2 {
    let player_pos = (
      this.gameScene.getPlayer().body.position as Math.Vector2
    ).clone();
    if (
      Math.Distance.BetweenPoints(player_pos, this.body.position) <= Consts.TILE
    ) {
      this.moveState = MoveState.Talking;
      if (!this.dialogBox.visible) {
        this.showDialog();
      }
      return Math.Vector2.ZERO;
    } else {
      return player_pos.subtract(this.body.position).normalize().scale(200);
    }
  }

  private showDialog(): void {
    this.dialogBox
      .setPosition(this.x - Consts.TILE * 3, this.y - Consts.TILE * 3)
      .setVisible(true);
    this.dialogText
      .setPosition(this.dialogBox.x + 16, this.dialogBox.y + 16)
      .setVisible(true);
    this.updateDialogText();
  }

  private hideDialog(): void {
    this.dialogBox.setVisible(false);
    this.dialogText.setVisible(false);
    this.currSetenceIndex = 1;
  }

  private checkRenderDepth(): void {
    if (this.gameScene.getPlayer().y < this.y) {
      this.setDepth(Consts.Layers.NPCInFront);
    } else {
      this.setDepth(Consts.Layers.NPCBehind);
    }
  }
}
