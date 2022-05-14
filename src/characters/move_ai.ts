import { Math, Scene } from "phaser";

export class MoveAI {
  private scene: Scene;
  private timer: Phaser.Time.TimerEvent;
  private moveSpeed: number;

  private rnd = new Math.RandomDataGenerator();
  private direction = new Math.Vector2();
  private isMoving = false;

  constructor(scene: Scene, moveSpeed: number) {
    this.scene = scene;
    this.timer = scene.time.addEvent({ paused: true });
    this.moveSpeed = moveSpeed;
  }

  public getMovement(): Math.Vector2 {
    if (this.timer.paused || this.timer.getRemaining() === 0) {
      this.isMoving = !this.isMoving;

      let duration = this.isMoving
        ? this.rnd.integerInRange(300, 500)
        : this.rnd.integerInRange(1000, 2000);

      this.timer = this.scene.time.addEvent({
        delay: duration,
      });

      this.direction = this.isMoving
        ? this.rnd.pick([
            Math.Vector2.LEFT,
            Math.Vector2.RIGHT,
            Math.Vector2.UP,
            Math.Vector2.DOWN,
          ])
        : Math.Vector2.ZERO;
    }
    return this.direction.clone().scale(this.moveSpeed);
  }
}
