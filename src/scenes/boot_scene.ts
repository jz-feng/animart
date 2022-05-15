import WebFontFile from "../web_font_file";
import { Consts } from "../consts";
import { Assets } from "../assets";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene",
    });
  }

  preload(): void {
    this.cameras.main.setBackgroundColor(Consts.Colors.BACKGROUND);

    // font
    this.load.addFile(new WebFontFile(this.load, Consts.FONT));

    // images
    // this.load.image("foo", "assets/foo.png");

    this.load.spritesheet(Assets.PLAYER, "assets/characters/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet(Assets.NPC, "assets/characters/radishmascot.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Tilemap
    this.load.image(Assets.Tilemap.TILESET_IMG, "assets/maps/tileset.png");
    this.load.tilemapTiledJSON(
      Assets.Tilemap.TILEMAP_JSON,
      "assets/maps/tilemap.json"
    );

    // sound
    // this.load.audio("baz", "assets/sfx/baz.wav");
  }

  create(): void {
    // Trigger title scene
    this.scene.start("TitleScene");
  }
}
