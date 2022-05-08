import WebFontFile from "../web_font_file";
import { Consts } from "../consts";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene",
    });
  }

  preload(): void {
    this.cameras.main.setBackgroundColor(Consts.Colors.BACKGROUND);

    // font
    // this.load.addFile(new WebFontFile(this.load, Consts.FONT));

    // images
    // this.load.image("foo", "assets/foo.png");

    // this.load.spritesheet("bar", "assets/bar.png", {
    //   frameWidth: 64,
    //   frameHeight: 64,
    // });

    // sound
    // this.load.audio("baz", "assets/sfx/baz.wav");
  }

  create(): void {
    // Trigger title scene
    this.scene.start("TitleScene");
  }
}
