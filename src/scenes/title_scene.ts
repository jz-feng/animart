import { Consts } from "../consts";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: "TitleScene",
    });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(Consts.Colors.BACKGROUND);

    let title = this.add
      .text(Consts.GAME_WIDTH / 2, Consts.GAME_HEIGHT / 2, "title", {
        color: "#ffffff",
        fontFamily: Consts.FONT,
        fontSize: "128px",
      })
      .setOrigin(0.5, 0.5);

    this.add.tween({
      targets: title,
      y: Consts.GAME_HEIGHT / 2 - 16,
      ease: "Linear",
      yoyo: true,
      hold: 500,
      repeat: -1,
      repeatDelay: 500,
    });

    this.add
      .text(Consts.GAME_WIDTH / 2, Consts.TILE_SIZE * 6, "press space", {
        color: "#ffffff",
        fontFamily: Consts.FONT,
        fontSize: "32px",
      })
      .setOrigin(0.5, 0.5);

    this.input.keyboard.on("keydown-SPACE", () => this.startGame());
  }

  // Trigger main game scene
  startGame() {
    this.scene.start("GameScene");
  }
}
