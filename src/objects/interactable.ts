import { Events, GameObjects, Geom, Math, Physics, Sound } from "phaser";
import { Consts } from "../consts";
import { GameScene } from "../scenes/game_scene";
import { GroceryList } from "./grocery_list";

export enum InteractableType {
  Milk,
  Radish,
  CatFood,
  Yarn,
  Basket,
  Checkout,
  // special usage
  GoHome,
}

export class Interactable extends Events.EventEmitter {
  type: InteractableType;
  sprite: GameObjects.Rectangle;

  private successSound: Sound.BaseSound;
  private cashRegSound: Sound.BaseSound;

  constructor(
    scene: GameScene,
    type: InteractableType,
    location: Math.Vector2,
    size: Math.Vector2 = new Math.Vector2(Consts.TILE, Consts.TILE),
    offset: Math.Vector2 = Math.Vector2.ZERO
  ) {
    super();

    this.type = type;

    this.sprite = scene.add
      .rectangle(
        location.x + offset.x,
        location.y + offset.y,
        size.x,
        size.y,
        Consts.Colors.INTERACTABLE,
        0.1
      )
      .setOrigin(0, 0);

    scene.physics.add.existing(this.sprite);

    // Bigger bounding box
    (this.sprite.body as Physics.Arcade.Body).setSize(
      size.x + 16,
      size.y + 16,
      true
    );

    this.successSound = scene.sound.add("success");
    this.cashRegSound = scene.sound.add("cashReg");
  }

  public interact(): boolean {
    const body = this.sprite.body as Physics.Arcade.Body;

    if (!body.enable) {
      return false;
    }

    const list = GroceryList.get();

    if (body.embedded && this.type === list.getNextItem()) {
      body.setEnable(false);
      this.sprite.setVisible(false);
      if (this.type == InteractableType.Checkout) {
        this.cashRegSound.play();
      } else {
        this.successSound.play();
      }
      list.completeItem();

      this.emit("list_updated");

      return true;
    }
    return false;
  }
}
