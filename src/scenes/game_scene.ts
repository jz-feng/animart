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

    // this.add
    //   .rectangle(0, 0, Consts.GAME_WIDTH, Consts.GAME_HEIGHT, 0xf8aa74)
    //   .setOrigin(0, 0);

    let tilemap = this.add.tilemap(
      "tilemap",
      Consts.TILE_SIZE,
      Consts.TILE_SIZE,
      Consts.MAP_WIDTH,
      Consts.MAP_HEIGHT
    );
    let collision_layer = tilemap.createLayer("Collision", "tiles");
    console.log(tilemap.layers);
    collision_layer.setCollisionBetween(0, 256, true);

    this.player = new Player(this);

    this.camera = this.cameras.main;
    this.camera.startFollow(this.player.getSprite());

    this.physics.add.existing(this.player.getSprite());
    this.physics.add.collider(this.player.getSprite(), collision_layer);

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
        new MoveAI(this, 2)
      )
    );

    this.npcs.push(
      new NPC(
        this,
        this.add.rectangle(
          512,
          256,
          Consts.TILE_SIZE,
          Consts.TILE_SIZE,
          0x000000
        ),
        new MoveAI(this, 2)
      )
    );
  }

  update(): void {
    this.player.update();
    this.npcs.forEach((npc) => npc.update());
  }
}
