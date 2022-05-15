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
    this.load.image(Assets.Tilemap.TILESET_IMG, "assets/objects/objects.png");
    this.load.tilemapTiledJSON(
      Assets.Tilemap.TILEMAP_JSON,
      "assets/maps/tilemap.json"
    );

    // sound
    this.load.audio("bgm", "assets/sfx/bgm.wav");
    this.load.audio("energyLost", "assets/sfx/energy_lost.wav");
    this.load.audio("gameOverMeow", "assets/sfx/meow_angry.wav");
    this.load.audio("gameStartMeow", "assets/sfx/meow.wav");
    this.load.audio("spotted", "assets/sfx/spotted.wav");
    this.load.audio("female_1", "assets/sfx/voices/VoiceFemaleHigh1.wav");
    this.load.audio("female_2", "assets/sfx/voices/VoiceFemaleHigh2.wav");
    this.load.audio("female_3", "assets/sfx/voices/VoiceFemaleHigh3.wav");
    this.load.audio("female_4", "assets/sfx/voices/VoiceFemaleHigh4.wav");
    this.load.audio("female_5", "assets/sfx/voices/VoiceFemaleHigh5.wav");
    this.load.audio("male_1", "assets/sfx/voices/VoiceMaleHigh1.wav");
    this.load.audio("male_2", "assets/sfx/voices/VoiceMaleHigh2.wav");
    this.load.audio("male_3", "assets/sfx/voices/VoiceMaleHigh3.wav");
    this.load.audio("male_4", "assets/sfx/voices/VoiceMaleHigh4.wav");
    this.load.audio("male_5", "assets/sfx/voices/VoiceMaleHigh5.wav");
  }

  create(): void {
    this.game.sound.add("bgm", { loop: true });

    // Trigger title scene
    this.scene.start("TitleScene");
  }
}
