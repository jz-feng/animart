import { Consts } from "../consts";
import { MoveAI } from "../characters/move_ai";
import { NPC } from "../characters/npc";
import { Player } from "../characters/player";
import { Assets } from "../assets";
import { GameObjects, Math, Tilemaps } from "phaser";
import { Interactable, InteractableType } from "../objects/interactable";
import { Utils } from "../utils";

export class GameScene extends Phaser.Scene {
  private camera: Phaser.Cameras.Scene2D.Camera;

  private player: Player;
  private npcs: NPC[] = [];
  private interactables: Interactable[] = [];

  private energyBar: GameObjects.Rectangle;

  public collisionLayer: Tilemaps.TilemapLayer;

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
    this.collisionLayer = tilemap.createLayer(
      "Collision",
      Assets.Tilemap.TILESET_NAME
    );
    let in_front_layer = tilemap.createLayer(
      "InFront",
      Assets.Tilemap.TILESET_NAME
    );
    in_front_layer.depth = 1;

    // Set collision for all tiles on collision layer. NOTE: only include non-empty tiles
    this.collisionLayer.setCollisionBetween(0, 5, true);

    this.player = new Player(this);

    this.camera = this.cameras.main;
    this.camera.startFollow(this.player.getSprite());

    this.physics.add.collider(this.player.getSprite(), this.collisionLayer);

    this.npcs.push(
      new NPC(
        this,
        this.add.sprite(256, 256, Assets.PLAYER),
        new MoveAI(this, 128),
        true
      )
    );

    this.npcs.push(
      new NPC(
        this,
        this.add.sprite(512, 200, Assets.PLAYER),
        new MoveAI(this, 128),
        true
      )
    );

    this.npcs.forEach((npc) =>
      this.physics.add.collider(npc.getSprite(), this.collisionLayer)
    );

    this.setUpInputs();
    this.setUpUI();
    this.setUpInteractables();
  }

  update(): void {
    this.player.update();
    this.npcs.forEach((npc) => npc.update());

    this.energyBar.setScale(this.player.getEnergy() / Player.MAX_ENERGY, 1);
  }

  getPlayer(): Player {
    return this.player;
  }

  private setUpInputs(): void {
    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.player.canMove()) {
        this.player.endConvo();
        this.npcs.forEach((npc) => {
          if (!npc.canMove()) npc.endConvo();
        });
      }
    });

    this.input.keyboard.on("keydown-E", () => this.checkInteract());
  }

  private setUpUI(): void {
    let ui_layer = this.add.group();

    this.energyBar = this.add
      .rectangle(Consts.TILE_SIZE * 11, 32, Consts.TILE_SIZE * 4, 32, 0xffffff)
      .setOrigin(0, 0);
    this.energyBar.setScrollFactor(0);
    ui_layer.add(this.energyBar);
    // ui_layer.getChildren().forEach(c => c.set)
  }

  private setUpInteractables(): void {
    this.interactables.push(
      new Interactable(this, Utils.tilesToPixels(1, 2), InteractableType.Milk),
      new Interactable(this, Utils.tilesToPixels(5, 6), InteractableType.Toy)
    );

    this.physics.add.overlap(
      this.interactables.map((i) => i.highlight),
      this.player.getSprite()
    );
  }

  private checkInteract(): void {
    if (this.player.canMove()) {
      // Find which object the player is interacting with
      for (let index in this.interactables) {
        const i = this.interactables[index];
        const success = i.interact();
        if (success) {
          console.log(i.type);
          break;
        }
      }
    }
  }
}
