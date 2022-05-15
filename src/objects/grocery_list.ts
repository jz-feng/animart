import { InteractableType } from "./interactable";

export class GroceryList {
  private static instance: GroceryList;
  private list: InteractableType[] = [];

  constructor() {
    // Backwards order
    this.list.push(InteractableType.Checkout);
    this.list.push(InteractableType.Yarn);
    this.list.push(InteractableType.Radish);
    this.list.push(InteractableType.CatFood);
    this.list.push(InteractableType.Milk);
    this.list.push(InteractableType.Basket);
  }

  public static get(): GroceryList {
    if (!GroceryList.instance) {
      GroceryList.instance = new GroceryList();
    }
    return GroceryList.instance;
  }

  public getNextItem(): InteractableType {
    return this.list.at(-1);
  }

  public completeItem(): void {
    this.list.pop();
    console.log(this.list);
  }

  public isFinished(): boolean {
    return this.list.length === 0;
  }

  public getItemStrings(): Map<InteractableType, string> {
    return new Map([
      [InteractableType.Basket, "grab a basket"],
      [InteractableType.Milk, "get some milk"],
      [InteractableType.CatFood, "stock up on cat food"],
      [InteractableType.Radish, "need more radishes"],
      [InteractableType.Yarn, "ball of yarn"],
      [InteractableType.Checkout, "go to checkout"],
    ]);
  }
}
