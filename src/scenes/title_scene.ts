import { Consts } from "../consts";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: "TitleScene",
    });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(Consts.Colors.BACKGROUND);

    this.add.text(0, 0, "title", {
      color: "#000000",
    });

    this.input.keyboard.on("keydown-SPACE", () => this.startGame());
  }

  // Trigger main game scene
  startGame() {
    this.scene.start("GameScene");
  }
}
