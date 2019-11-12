type HealthBar = import('../../../vendorModules/healthbar/HealthBar.standalone.js');
interface Damagable {
  health: number;
  healthBar: HealthBar;
  initHealthBar: () => HealthBar;
  onDamage: () => void;
  onDestroy: () => void;
}
interface BarConfig {
  width?: number;
  height?: number;
  x: number;
  y: number;
  bg?: {
    color: number;
  };
  bar?: {
    color: number;
  };
  animationDuration?: number;
  flipped?: boolean;
}
