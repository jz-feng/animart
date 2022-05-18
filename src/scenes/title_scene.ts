import { Consts } from "../consts";

export class TitleScene extends Phaser.Scene {
  private gameStartMeow: Phaser.Sound.BaseSound;

  constructor() {
    super({
      key: "TitleScene",
    });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(Consts.Colors.BACKGROUND);

    this.add.image(0, 0, "title").setOrigin(0, 0);

    let start = this.add
      .text(210, 360, "press space", {
        color: "#ffffff",
        fontFamily: Consts.FONT,
        fontSize: "32px",
      })
      .setOrigin(0.5, 0.5);

    this.add.tween({
      targets: start,
      y: 360 - 16,
      ease: "Linear",
      yoyo: true,
      hold: 500,
      repeat: -1,
      repeatDelay: 500,
    });

    this.input.keyboard.on("keydown-SPACE", () => this.startGame());

    this.gameStartMeow = this.sound.add("gameStartMeow");
  }

  // Trigger main game scene
  startGame() {
    this.gameStartMeow.play();
    this.scene.start("GameScene");
  }
}
