import { Consts } from "../consts";
import { MoveAI } from "../characters/move_ai";
import { NPC } from "../characters/npc";
import { Player } from "../characters/player";

export class GameScene extends Phaser.Scene {
  private camera: Phaser.Cameras.Scene2D.Camera;

  private player: Player;
  private npcs: NPC[] = [];

  constructor() {
    super({
      key: "GameScene",
    });
  }

  preload(): void {}

  create(): void {
    this.cameras.main.setBackgroundColor(Consts.Colors.BACKGROUND);

    this.add
      .rectangle(0, 0, Consts.GAME_WIDTH, Consts.GAME_HEIGHT, 0xf8aa74)
      .setOrigin(0, 0);

    this.player = new Player(this);

    this.camera = this.cameras.main;
    this.camera.startFollow(this.player.sprite);

    this.npcs.push(
      new NPC(
        this,
        this.add.rectangle(
          256,
          256,
          Consts.TILE_SIZE,
          Consts.TILE_SIZE,
          0x000000
        ),
        new MoveAI(this, 3)
      )
    );

    this.npcs.push(
      new NPC(
        this,
        this.add.rectangle(
          900,
          256,
          Consts.TILE_SIZE,
          Consts.TILE_SIZE,
          0x000000
        ),
        new MoveAI(this, 3)
      )
    );
  }

  update(): void {
    this.player.update();
    this.npcs.forEach((npc) => npc.update());
  }
}
