export namespace Consts {
  export const FONT = "VT323";

  export const DEV = "development";

  export namespace Colors {
    export const BACKGROUND = "#ece9c7";
  }

  export enum Layers {
    UI = 10,
    Dialog = 9,
    Overlay = 3,
    InFront2 = 2,
    InFront = 1,
    Player = 0,
    Behind = -1,
    Collision = -2,
    Floor = -10,
  }

  export const TILE_SIZE = 64;
  export const MAP_WIDTH = 20;
  export const MAP_HEIGHT = 16;
  export const GAME_WIDTH = TILE_SIZE * 12;
  export const GAME_HEIGHT = TILE_SIZE * 8;
}
