import { Consts } from "../consts";
import { MoveAI } from "../characters/move_ai";
import { NPC } from "../characters/npc";
import { Player } from "../characters/player";
import { Assets } from "../assets";

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

    let tilemap = this.add.tilemap(
      Assets.Tilemap.TILEMAP_JSON,
      Consts.TILE_SIZE,
      Consts.TILE_SIZE,
      Consts.MAP_WIDTH,
      Consts.MAP_HEIGHT
    );
    tilemap.addTilesetImage(
      Assets.Tilemap.TILESET_NAME,
      Assets.Tilemap.TILESET_IMG
    );

    let floor_layer = tilemap.createLayer("Floor", Assets.Tilemap.TILESET_NAME);
    let collision_layer = tilemap.createLayer(
      "Collision",
      Assets.Tilemap.TILESET_NAME
    );
    let in_front_layer = tilemap.createLayer(
      "InFront",
      Assets.Tilemap.TILESET_NAME
    );
    in_front_layer.depth = 1;

    // Set collision for all tiles on collision layer. NOTE: only include non-empty tiles
    collision_layer.setCollisionBetween(0, 5, true);

    this.player = new Player(this);

    this.camera = this.cameras.main;
    this.camera.startFollow(this.player.getSprite());

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
        new MoveAI(this, 128)
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
        new MoveAI(this, 128)
      )
    );

    this.npcs.forEach((npc) =>
      this.physics.add.collider(npc.getSprite(), collision_layer)
    );
  }

  update(): void {
    this.player.update();
    this.npcs.forEach((npc) => npc.update());
  }
}
