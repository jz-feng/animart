import { Consts } from "../consts";
import { NPC } from "../objects/npc";
import { Player } from "../objects/player";

export class GameScene extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Scene2D.Camera;

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

    let npc = new NPC(
      this,
      this.add.rectangle(256, 256, Consts.TILE_SIZE, Consts.TILE_SIZE, 0x000000)
    );
  }

  update(): void {
    this.player.update();
  }
}
