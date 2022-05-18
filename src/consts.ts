export namespace Consts {
  export const FONT = "VT323";

  export const DEV = "development";

  export namespace Colors {
    export const BACKGROUND = "#ece9c7";
  }

  export enum Layers {
    Dialog = 11,
    UI = 10,
    Overlay = 4,
    InFront2 = 3,
    InFront = 2, // Terrain in front of the player
    NPCInFront = 1, // Used for when NPCs stand in front of the player
    Player = 0,
    NPCBehind = -1, // Used for when NPCs stand behind the player
    Behind = -2, // Terrain behind the player
    Collision = -3,
    Floor = -10,
  }

  export const TILE_SIZE = 64;
  export const MAP_WIDTH = 20;
  export const MAP_HEIGHT = 16;
  export const GAME_WIDTH = TILE_SIZE * 12;
  export const GAME_HEIGHT = TILE_SIZE * 8;
}
