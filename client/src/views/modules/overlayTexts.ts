import UIScene from '../uiScene';

let overlayTexts = {};
const initOverlayTexts = (scene: UIScene) => {
  const titleText: Phaser.GameObjects.Text = scene.add.text(20, 20, 'Title Text', { fontSize: '16px' });
  const debugText: Phaser.GameObjects.Text = scene.add.text(20, 50, 'Testing', { fontSize: '16px' });
  const userNameText: Phaser.GameObjects.Text = scene.add.text(
    20,
    80,
    `Player name: ${scene.registry.get('userName')}`,
    { fontSize: '16px' }
  );
  const errorText: Phaser.GameObjects.Text = scene.add.text(20, 110, '', { fontSize: '16px', color: 'red' });
  const SELECTED_ENTITY_TITLE: Phaser.GameObjects.Text = scene.add.text(20, 600, 'Currently Selected: ', {
    fontSize: '16px',
    color: '#0000ff',
    stroke: '#004489',
    strokeThickness: '2'
  });
  const selectedEntityText: Phaser.GameObjects.Text = scene.add.text(20, 620, '', {
    fontSize: '16px',
    color: '#0000ff',
    stroke: '#004489',
    strokeThickness: '2'
  });
  overlayTexts = { titleText, debugText, userNameText, errorText, SELECTED_ENTITY_TITLE, selectedEntityText };
};

const getOverlayTexts = () => overlayTexts;

export { initOverlayTexts, getOverlayTexts };
