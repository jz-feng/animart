import "phaser";
import { Consts } from "./consts";
import { BootScene } from "./scenes/boot_scene";
import { GameScene } from "./scenes/game_scene";
import { TitleScene } from "./scenes/title_scene";

type GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = {
  title: "AniMart",
  width: Consts.GAME_WIDTH,
  height: Consts.GAME_HEIGHT,
  type: Phaser.AUTO,
  parent: "game",
  scene: [BootScene, TitleScene, GameScene],
  input: {
    keyboard: true,
  },
  backgroundColor: "#ffffff",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  render: {
    pixelArt: true,
  },
};

export class AniMartGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new AniMartGame(config);
};
