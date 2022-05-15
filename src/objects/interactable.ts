import { GameObjects, Geom, Math, Physics } from "phaser";
import { Consts } from "../consts";
import { GameScene } from "../scenes/game_scene";

export enum InteractableType {
  Milk,
  Radish,
  CatFood,
  Yarn,
  Basket,
  Checkout,
}

export class Interactable {
  private scene: GameScene;
  private location: Math.Vector2;
  type: InteractableType;
  highlight: GameObjects.Rectangle;

  constructor(
    scene: GameScene,
    location: Math.Vector2,
    type: InteractableType
  ) {
    this.scene = scene;
    this.location = location;
    this.type = type;

    this.highlight = scene.add
      .rectangle(
        location.x,
        location.y,
        Consts.TILE_SIZE,
        Consts.TILE_SIZE,
        0xffffff,
        0.3
      )
      .setOrigin(0, 0);

    scene.physics.add.existing(this.highlight);

    // Bigger bounding box
    (this.highlight.body as Physics.Arcade.Body).setSize(
      Consts.TILE_SIZE + 16,
      Consts.TILE_SIZE + 16,
      true
    );
  }

  public interact(): boolean {
    const body = this.highlight.body as Physics.Arcade.Body;
    if (body.embedded) {
      this.highlight.setAlpha(0);
      return true;
    }
    return false;
  }
}
