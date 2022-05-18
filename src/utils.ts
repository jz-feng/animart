import { Math } from "phaser";
import { Consts } from "./consts";

export class Utils {
  public static tilesToPixels(x: number, y: number): Math.Vector2 {
    return new Math.Vector2(x, y).scale(Consts.TILE);
  }
}
