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
  private alert: GameObjects.Text;
  private cooldown: Time.TimerEvent;

  private dialogBox: GameObjects.Rectangle;
  private dialogText: GameObjects.Text;
  private dialogSentences: string[];
  private currSetenceIndex = 1;

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
    canSee: boolean
  ) {
    super(
      scene,
      scene.add.sprite(location.x, location.y, Assets.NPC, 0),
      "NPC"
    );

    this.rnd = new Math.RandomDataGenerator();

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

    this.cooldown = scene.time.addEvent({
      paused: true,
    });

    // sound
    this.spottedSound = scene.sound.add("spotted");
    for (let i = 1; i < 6; i++) {
      this.speechSounds.push(scene.sound.add(voice + "_" + i));
    }

    this.dialogBox = scene.add
      .rectangle(0, 0, Consts.TILE_SIZE * 7, Consts.TILE_SIZE * 3, 0xffffff)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x888888)
      .setVisible(false)
      .setDepth(3);

    this.dialogText = scene.add
      .text(0, 0, "", {
        color: "#888888",
        fontFamily: Consts.FONT,
        fontSize: "24px",
        align: "left",
        wordWrap: {
          width: Consts.TILE_SIZE * 7 - 32,
          useAdvancedWrap: true,
        },
      })
      .setOrigin(0, 0)
      .setVisible(false)
      .setDepth(3);

    this.dialogSentences = dialogText;
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
      // !this.hasInteracted &&
      (this.cooldown.paused || this.cooldown.getRemaining() === 0) &&
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

    this.speechSounds.at(0).play();
  }

  public continueConvo(): void {
    if (this.currSetenceIndex < this.dialogSentences.length) {
      this.currSetenceIndex++;
      this.updateDialogText();

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
    super.endConvo();

    (this.scene as GameScene).triggerEndConvo();

    this.cooldown = this.scene.time.addEvent({ delay: 5000 });

    this.alert.setVisible(false);
    this.hideDialog();
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
      if (!this.dialogBox.visible) {
        this.showDialog();
      }
      return Math.Vector2.ZERO;
    } else {
      return player_pos
        .subtract(this.sprite.body.position)
        .normalize()
        .scale(200);
    }
  }

  private showDialog(): void {
    this.dialogBox
      .setPosition(
        this.sprite.x - Consts.TILE_SIZE * 3,
        this.sprite.y - Consts.TILE_SIZE * 3
      )
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
}
