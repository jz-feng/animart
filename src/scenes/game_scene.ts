import { Consts } from "../consts";
import { MoveAI } from "../characters/move_ai";
import { NPC } from "../characters/npc";
import { Player } from "../characters/player";
import { Assets } from "../assets";
import { GameObjects, Math, Tilemaps, Time } from "phaser";
import { Interactable, InteractableType } from "../objects/interactable";
import { Utils } from "../utils";
import { GroceryList } from "../objects/grocery_list";
import { MoveState } from "../characters/movable";

export class GameScene extends Phaser.Scene {
  // Objects
  private player: Player;
  private npcs: NPC[] = [];
  private interactables: Interactable[] = [];

  // UI
  private energyBar: GameObjects.Rectangle;
  private groceryList: Map<InteractableType, GameObjects.Text> = new Map();
  private timer: Time.TimerEvent;
  private timerText: GameObjects.Text;

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
      Consts.TILE,
      Consts.TILE,
      Consts.MAP_WIDTH,
      Consts.MAP_HEIGHT
    );
    tilemap.addTilesetImage(
      Assets.Tilemap.TILESET_NAME,
      Assets.Tilemap.TILESET_IMG
    );

    tilemap
      .createLayer("Floor", Assets.Tilemap.TILESET_NAME)
      .setDepth(Consts.Layers.Floor);
    this.collisionLayer = tilemap
      .createLayer("Collision", Assets.Tilemap.TILESET_NAME)
      .setDepth(Consts.Layers.Collision);
    tilemap
      .createLayer("Behind", Assets.Tilemap.TILESET_NAME)
      .setDepth(Consts.Layers.Behind);
    tilemap
      .createLayer("InFront", Assets.Tilemap.TILESET_NAME)
      .setDepth(Consts.Layers.InFront);
    tilemap
      .createLayer("InFront2", Assets.Tilemap.TILESET_NAME)
      .setDepth(Consts.Layers.InFront);

    // Set collision for all tiles on collision layer. id=60 is magic non-colliding tile
    this.collisionLayer.setCollisionByExclusion([60], true);

    this.player = new Player(this, Utils.tilesToPixels(14.5, 14));

    this.physics.add.collider(this.player, this.collisionLayer);

    this.cameras.main.startFollow(this.player);

    let exit = this.add
      .rectangle(
        Consts.TILE * 14,
        Consts.TILE * 15.5,
        Consts.TILE * 2,
        Consts.TILE / 2
      )
      .setOrigin(0, 0)
      .setVisible(false);
    let exit_group = this.physics.add.staticGroup([exit]);

    this.physics.add.collider(
      this.player,
      exit_group,
      null,
      () => !GroceryList.get().isComplete()
    );

    this.physics.add.overlap(this.player, exit_group, () => this.triggerExit());

    GroceryList.reset();

    this.setUpNPCs();
    this.setUpInputs();
    this.setUpUI();
    this.setUpInteractables();
    this.setUpAnimations();
    this.setUpEvents();
    this.setUpSound();
  }

  update(): void {
    this.player.update();
    this.npcs.forEach((npc) => npc.update());

    this.updateTimer();

    // this.energyBar.setScale(this.player.getEnergy() / Player.MAX_ENERGY, 1);
  }

  getPlayer(): Player {
    return this.player;
  }

  private setUpNPCs(): void {
    this.npcs.push(
      new NPC(
        this,
        Utils.tilesToPixels(3, 3),
        new MoveAI(this, 128),
        Assets.Text.T5,
        "female"
      )
    );
    this.npcs.push(
      new NPC(
        this,
        Utils.tilesToPixels(8, 6),
        new MoveAI(this, 128),
        Assets.Text.T4,
        "male"
      )
    );
    this.npcs.push(
      new NPC(
        this,
        Utils.tilesToPixels(15, 6),
        new MoveAI(this, 128),
        Assets.Text.T3,
        "female"
      )
    );
    this.npcs.push(
      new NPC(
        this,
        Utils.tilesToPixels(2, 11),
        new MoveAI(this, 128),
        Assets.Text.T2,
        "male_low"
      )
    );
    this.npcs.push(
      new NPC(
        this,
        Utils.tilesToPixels(11, 5),
        new MoveAI(this, 128),
        Assets.Text.T4,
        "female_low"
      )
    );
    this.npcs.push(
      new NPC(
        this,
        Utils.tilesToPixels(6, 8),
        new MoveAI(this, 128),
        Assets.Text.T5,
        "male"
      )
    );
    this.npcs.push(
      // stands by the door
      new NPC(
        this,
        Utils.tilesToPixels(13, 12),
        new MoveAI(this, 128),
        Assets.Text.T1,
        "female",
        20
      )
    );

    this.npcs.forEach((npc) =>
      this.physics.add.collider(npc, this.collisionLayer)
    );
  }

  private setUpInputs(): void {
    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.player.canMove()) {
        this.npcs.forEach((npc) => {
          if (!npc.canMove()) npc.continueConvo();
        });
      } else {
        this.checkInteract();
      }
    });
  }

  public triggerEndConvo(): void {
    this.player.endConvo();
  }

  private setUpUI(): void {
    // For some reason scroll factor doesn't work on layers
    let ui_layer = this.add.layer();

    this.energyBar = this.add
      .rectangle(Consts.TILE * 8, 32, Consts.TILE * 3.5, 32, 0xeebbcc)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setVisible(false);
    ui_layer.add(this.energyBar);
    ui_layer.setDepth(Consts.Layers.UI);

    const sheet = this.add
      .rectangle(
        16,
        Consts.TILE * 4,
        Consts.TILE * 3 + 16,
        Consts.TILE * 4 - 16,
        0xffffff
      )
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x888888)
      .setScrollFactor(0);
    ui_layer.add(sheet);

    const text_style = {
      color: "#888888",
      fontFamily: Consts.FONT,
      fontSize: "20px",
    };

    ui_layer.add(
      this.add
        .text(sheet.x + 16, sheet.y + 8, "grocery list", text_style)
        .setOrigin(0, 0)
        .setScrollFactor(0)
    );

    const items = GroceryList.get().getItemStrings();
    let i = 0;
    for (let type of items.keys()) {
      let item = this.add
        .text(
          sheet.x + 16,
          sheet.y + 24 + 16 + i * 24,
          "- " + items.get(type),
          text_style
        )
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.groceryList.set(type, item);
      ui_layer.add(item);
      i++;
    }

    this.timerText = this.add
      .text(Consts.GAME_WIDTH - 16, 16, "", {
        color: Consts.Colors.GRAYED_TEXT,
        fontFamily: Consts.FONT,
        fontSize: "32px",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);
    ui_layer.add(this.timerText);

    this.timer = this.time.addEvent({ delay: 10 * 60 * 1000 });

    ui_layer.sendToBack(sheet);
  }

  private setUpInteractables(): void {
    this.interactables.push(
      new Interactable(
        this,
        InteractableType.Basket,
        Utils.tilesToPixels(16, 14),
        new Math.Vector2(Consts.TILE * 2, Consts.TILE)
      ),
      new Interactable(
        this,
        InteractableType.Milk,
        Utils.tilesToPixels(9, 1),
        new Math.Vector2(Consts.TILE * 2, Consts.TILE * 2)
      ),
      new Interactable(
        this,
        InteractableType.Radish,
        Utils.tilesToPixels(16, 9),
        new Math.Vector2(Consts.TILE * 2, Consts.TILE)
      ),
      new Interactable(
        this,
        InteractableType.CatFood,
        Utils.tilesToPixels(1, 4),
        new Math.Vector2(Consts.TILE, Consts.TILE * 2)
      ),
      new Interactable(
        this,
        InteractableType.CatFood,
        Utils.tilesToPixels(1, 6),
        new Math.Vector2(Consts.TILE, Consts.TILE * 2)
      ),
      new Interactable(
        this,
        InteractableType.Yarn,
        Utils.tilesToPixels(7, 4),
        new Math.Vector2(Consts.TILE / 2, Consts.TILE * 2)
      ),
      new Interactable(
        this,
        InteractableType.Checkout,
        Utils.tilesToPixels(4, 10),
        new Math.Vector2(Consts.TILE, Consts.TILE * 3)
      ),
      new Interactable(
        this,
        InteractableType.Checkout,
        Utils.tilesToPixels(7, 10),
        new Math.Vector2(Consts.TILE, Consts.TILE * 3)
      )
    );

    this.physics.add.overlap(
      this.interactables.map((i) => i.sprite),
      this.player
    );

    this.interactables.forEach((i) =>
      i.on("list_updated", () => {
        this.groceryList.get(i.type).setColor(Consts.Colors.GRAYED_TEXT);
        if (GroceryList.get().isComplete()) {
          // this.triggerGameWin();
        }
      })
    );

    this.add
      .group(this.interactables.map((i) => i.sprite))
      .setDepth(Consts.Layers.Overlay);
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

    this.anims.create({
      key: "npc_idle_front",
      frames: this.anims.generateFrameNumbers(Assets.NPC, {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "npc_idle_back",
      frames: this.anims.generateFrameNumbers(Assets.NPC, {
        start: 8,
        end: 11,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "npc_walk_front",
      frames: this.anims.generateFrameNumbers(Assets.NPC, {
        start: 16,
        end: 19,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "npc_walk_back",
      frames: this.anims.generateFrameNumbers(Assets.NPC, {
        start: 24,
        end: 27,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  private setUpEvents(): void {
    this.player.on("game_over", () => this.triggerGameOver());
  }

  private setUpSound(): void {
    let bgm = this.game.sound.get("bgm");
    if (!bgm.isPlaying) {
      bgm.play(null, {
        volume: 0.8,
      });
    }

    this.sound.add("energyLost");
    this.sound.add("gameOverMeow");
  }

  private triggerGameOver(): void {
    let game_over = this.add
      .text(Consts.GAME_WIDTH / 2, Consts.GAME_HEIGHT / 2, "Game Over", {
        color: "#fde9dd",
        fontFamily: Consts.FONT,
        fontSize: "64px",
        stroke: "#888888",
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);
    // this.add.tween({
    //   targets: game_over,
    //   alpha: 0,
    // });
    this.player.setMoveState(MoveState.Talking);
  }

  private triggerExit(): void {
    if (
      !GroceryList.get().isComplete() ||
      this.player.getState() === MoveState.Talking
    ) {
      return;
    }

    this.player.setMoveState(MoveState.Talking);
    this.groceryList
      .get(InteractableType.GoHome)
      .setColor(Consts.Colors.GRAYED_TEXT);

    this.timer.paused = true;

    // Fade to white and return to title
    this.cameras.main.fadeOut(3000, 255, 255, 255, (_, progress) => {
      if (progress === 1) {
        this.scene.stop("GameScene");
        this.scene.remove("GameScene");
        this.scene.start("TitleScene");
      }
    });
  }

  private updateTimer(): void {
    let date = new Date(null);
    date.setMilliseconds(this.timer.getElapsed());
    this.timerText.setText(date.toISOString().substring(15, 21));
  }
}
