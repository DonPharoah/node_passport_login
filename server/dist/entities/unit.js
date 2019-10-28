// import MainScene from '../scenes/mainScene';
// import Building from './building';
// class Unit {
//   private _target: Building;
//   private _rectangle: any;
//   private static FILL_COLOR = 0xffffff;
//   constructor(scene: MainScene, x: number, y: number, target?: Building) {
//     super(scene, 'unit');
//     this._rectangle = scene.add.rectangle(x, y, 10, 10, Unit.FILL_COLOR) as any;
//     scene.physics.add.existing(this._rectangle);
//     this._target = target;
//     if (target) {
//       const targetPosition = this._target.rectangle.getCenter();
//       const currentPosition = this._rectangle.getCenter();
//       const distance = targetPosition.subtract(currentPosition);
//       this._rectangle.body.setVelocity(distance.x, distance.y);
//     } else {
//       this._rectangle.body.setVelocity(10, 20);
//     }
//   }
//   public getPosition() {
//     const position = this._rectangle.getCenter();
//     return { x: position.x, y: position.y };
//   }
// }
// export default Unit;
//# sourceMappingURL=unit.js.map