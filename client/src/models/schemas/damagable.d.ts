interface Damagable {
  currentHealth: number;
  healthBar: Phaser.GameObjects.Graphics;
  healthBarWidth: number;
  healthBarHeight: number;
  initHealthBar(): void;
  checkHealthAndRedraw: () => void;
  redrawHealthBar: () => void;
  setHealth: (newHealth: number) => void;
}
