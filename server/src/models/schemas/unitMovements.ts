import { Vector, Body } from 'matter-js';

export interface UnitAI {
  onStart(): void;
  update(entity: Entity): void;
  onEnd(): void;
}

export class IdleAI implements UnitAI {
  onStart() {}
  update() {}
  onEnd() {}
}

export class GotoAI implements UnitAI {
  private onArrivalEvent = () => {};
  private targetPosition: { x; y };
  private self: Unit;

  constructor(self: Unit, targetPosition: { x; y }, onArrivalEvent?: () => void) {
    this.self = self;
    this.targetPosition = targetPosition;
    //const distance = Vector.sub(targetPosition, self.body.position);
    //const perpendicular = Vector.normalise(Vector.perp(distance));
    //const radius = Vector.mult(perpendicular, 100);
    //this.targetPosition = Vector.add(radius, targetPosition);
    //Body.setVelocity(this.self.body, Vector.div(distance, 100));
    if (onArrivalEvent) this.onArrivalEvent = onArrivalEvent;
  }
  onStart() {}
  public update() {
    const currentPosition = this.self.body.position;
    const distance = Vector.sub(this.targetPosition, currentPosition);
    Body.setVelocity(this.self.body, Vector.mult(Vector.normalise(distance), 2));
    if (Vector.magnitude(distance) <= 60) {
      this.onArrivalEvent();
    }
  }
  public onEnd() {}
}

export class OrbitAI implements UnitAI {
  //TODO FAST TRIG APROOXIMATIONS
  public owner: Entity;
  private readonly origin: { x; y };
  public angle: number = 0;
  private radius;
  private velocity: () => void;
  public targetBuilding: Building;
  constructor(
    owner: Entity,
    targetBuilding: Building,
    entryPosition: { x; y },
    radius: number,
    origin: { x; y }
  ) {
    this.origin = origin;
    this.owner = owner;
    this.radius = radius;
    const distance = Vector.sub(origin, entryPosition);
    const entryAngle = Math.atan2(distance.y, distance.x);
    if (entryAngle < Math.PI) this.angle = entryAngle + Math.PI;
    else this.angle = entryAngle;
    this.targetBuilding = targetBuilding;
    this.velocity = this.defaultVelocity;
  }
  defaultVelocity() {
    if (this.angle < Math.PI * 2) this.angle += 0.03;
    else this.angle = 0;
  }
  onStart() {
    this.targetBuilding.onUnitEnteredOrbit(this);
  }
  update(unit: Unit) {
    const x = this.radius * Math.cos(this.angle) + this.origin.x;
    const y = this.radius * Math.sin(this.angle) + this.origin.y;
    Body.setPosition(unit.body, { x, y });
    this.velocity();
  }
  setAngle(targetAngle: number) {
    /*let differenceAngle1 = this.angle - targetAngle;
    let differenceAngle2;
    if (differenceAngle1 > Math.PI) differenceAngle2 = 2 * Math.PI - differenceAngle1;
    else if (differenceAngle1 < -Math.PI) differenceAngle2 = -(2 * Math.PI) - differenceAngle1;

    console.log(differenceAngle1 * (180 / Math.PI) + '  ' + differenceAngle2 * (180 / Math.PI));

    if (Math.abs(differenceAngle2) < Math.abs(differenceAngle1)) differenceAngle1 = differenceAngle2;

    let counter = 0;
    let angleDelta = Math.abs(differenceAngle1) / 0.06;
    let smoothingVelocity = 0.06 * Math.sign(differenceAngle1);
    this.velocity = () => {
      if (counter < angleDelta) {
        this.angle += smoothingVelocity;
        counter++;
      } else {
        this.velocity = this.defaultVelocity;
      }
    };*/
    this.angle = targetAngle;
  }
  onEnd() {
    this.targetBuilding.onUnitLeftOrbit(this);
  }
}
