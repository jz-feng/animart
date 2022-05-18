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
}

export class Interactable extends Events.EventEmitter {
  private scene: GameScene;
  private location: Math.Vector2;
  type: InteractableType;
  highlight: GameObjects.Rectangle;

  private successSound: Sound.BaseSound;
  private cashRegSound: Sound.BaseSound;

  constructor(
    scene: GameScene,
    type: InteractableType,
    location: Math.Vector2,
    size: Math.Vector2 = new Math.Vector2(Consts.TILE_SIZE, Consts.TILE_SIZE),
    offset: Math.Vector2 = Math.Vector2.ZERO
  ) {
    super();

    this.scene = scene;
    this.location = location;
    this.type = type;

    this.highlight = scene.add
      .rectangle(
        location.x + offset.x,
        location.y + offset.y,
        size.x,
        size.y,
        0xaad7ef,
        0.4
      )
      .setOrigin(0, 0);

    scene.physics.add.existing(this.highlight);

    // Bigger bounding box
    (this.highlight.body as Physics.Arcade.Body).setSize(
      size.x + 16,
      size.y + 16,
      true
    );

    this.successSound = scene.sound.add("success");
    this.cashRegSound = scene.sound.add("cashReg");
  }

  public interact(): boolean {
    const body = this.highlight.body as Physics.Arcade.Body;

    if (!body.enable) {
      return false;
    }

    const list = GroceryList.get();

    if (body.embedded && this.type === list.getNextItem()) {
      body.setEnable(false);
      this.highlight.setVisible(false);
      if( this.type == InteractableType.Checkout){
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
