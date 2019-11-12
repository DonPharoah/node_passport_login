interface Damagable {
  maxHealth: number;
  currentHealth: number;
  healthBar: Phaser.GameObjects.Graphics;
  healthBarWidth: number;
  healthBarHeight: number;
  initHealthBar: () => void;
  checkHealthAndRedraw: () => void;
  redrawHealthBar: () => void;
  dealDamage: (damageAmount: number) => void;
  dealHealing: (healingAmount: number) => void;
  setHealth: (newHealth: number) => void;
}
