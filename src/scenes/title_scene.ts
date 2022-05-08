import { Consts } from "../consts";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: "TitleScene",
    });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(Consts.Colors.BACKGROUND);

    console.log("test");
  }

  // Trigger main game scene
  startGame() {
    this.scene.start("GameScene");
  }
}
