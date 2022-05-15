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
    this.cameras.main.setBackgroundColor("#ffffff");

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

    tilemap.createLayer("Floor", Assets.Tilemap.TILESET_NAME).setDepth(-10);
    this.collisionLayer = tilemap
      .createLayer("Collision", Assets.Tilemap.TILESET_NAME)
      .setDepth(-2);
    tilemap.createLayer("Behind", Assets.Tilemap.TILESET_NAME).setDepth(-1);
    tilemap.createLayer("InFront", Assets.Tilemap.TILESET_NAME).setDepth(1);
    tilemap.createLayer("InFront2", Assets.Tilemap.TILESET_NAME).setDepth(2);

    // Set collision for all tiles on collision layer. id=60 is magic non-colliding tile
    this.collisionLayer.setCollisionByExclusion([60], true);

    this.player = new Player(this, Utils.tilesToPixels(14.5, 14));

    this.camera = this.cameras.main;
    this.camera.startFollow(this.player.getSprite());

    this.physics.add.collider(this.player.getSprite(), this.collisionLayer);

    this.npcs.push(
      new NPC(this, Utils.tilesToPixels(3, 3), new MoveAI(this, 128), true)
    );

    this.npcs.push(
      new NPC(this, Utils.tilesToPixels(5, 3), new MoveAI(this, 128), true)
    );

    this.npcs.forEach((npc) =>
      this.physics.add.collider(npc.getSprite(), this.collisionLayer)
    );

    this.setUpInputs();
    this.setUpUI();
    this.setUpInteractables();
    this.setUpAnimations();
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
      .rectangle(Consts.TILE_SIZE * 8, 32, Consts.TILE_SIZE * 3.5, 32, 0xffffff)
      .setOrigin(0, 0);
    this.energyBar.setScrollFactor(0);
    ui_layer.add(this.energyBar);
    ui_layer.setDepth(10);
    // ui_layer.getChildren().forEach(c => c.set)
  }

  private setUpInteractables(): void {
    this.interactables.push(
      new Interactable(
        this,
        Utils.tilesToPixels(16, 14),
        InteractableType.Basket
      ),
      new Interactable(
        this,
        Utils.tilesToPixels(17, 14),
        InteractableType.Basket
      ),
      new Interactable(this, Utils.tilesToPixels(9, 2), InteractableType.Milk)
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

  private setUpAnimations(): void {
    this.anims.create({
      key: "player_idle_front_left",
      frames: this.anims.generateFrameNumbers(Assets.PLAYER, {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "player_idle_front_right",
      frames: this.anims.generateFrameNumbers(Assets.PLAYER, {
        start: 4,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "player_idle_back_left",
      frames: this.anims.generateFrameNumbers(Assets.PLAYER, {
        start: 12,
        end: 15,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "player_idle_back_right",
      frames: this.anims.generateFrameNumbers(Assets.PLAYER, {
        start: 8,
        end: 11,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "player_walk_front_left",
      frames: this.anims.generateFrameNumbers(Assets.PLAYER, {
        start: 16,
        end: 19,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "player_walk_front_right",
      frames: this.anims.generateFrameNumbers(Assets.PLAYER, {
        start: 20,
        end: 23,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "player_walk_back_left",
      frames: this.anims.generateFrameNumbers(Assets.PLAYER, {
        start: 28,
        end: 31,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "player_walk_back_right",
      frames: this.anims.generateFrameNumbers(Assets.PLAYER, {
        start: 24,
        end: 27,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.player.getSprite().play("player_idle_front_left");
  }
}
