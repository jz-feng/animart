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
    this.load.image("title", "assets/title.png");

    this.load.spritesheet(Assets.PLAYER, "assets/characters/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet(
      Assets.NPC,
      "assets/characters/radishspritesall.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    this.load.spritesheet("objects_sprite", "assets/objects/objects.png", {
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
    this.load.audio("success", "assets/sfx/success.wav");
    this.load.audio("cashReg", "assets/sfx/CashRegister.wav");
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
    this.load.audio("female_low_1", "assets/sfx/voices/VoiceFemaleLow1.wav");
    this.load.audio("female_low_2", "assets/sfx/voices/VoiceFemaleLow2.wav");
    this.load.audio("female_low_3", "assets/sfx/voices/VoiceFemaleLow3.wav");
    this.load.audio("female_low_4", "assets/sfx/voices/VoiceFemaleLow4.wav");
    this.load.audio("female_low_5", "assets/sfx/voices/VoiceFemaleLow5.wav");
    this.load.audio("male_low_1", "assets/sfx/voices/VoiceMaleLow1.wav");
    this.load.audio("male_low_2", "assets/sfx/voices/VoiceMaleLow2.wav");
    this.load.audio("male_low_3", "assets/sfx/voices/VoiceMaleLow3.wav");
    this.load.audio("male_low_4", "assets/sfx/voices/VoiceMaleLow4.wav");
    this.load.audio("male_low_5", "assets/sfx/voices/VoiceMaleLow4.wav"); // dupe
  }

  create(): void {
    this.game.sound.add("bgm", { loop: true });

    // Trigger title scene
    this.scene.start("TitleScene");
  }
}
