import UIScene from '../uiScene';
import UiScenePhaser from '../uiScenePhaser';

let overlayTexts = {};
const initOverlayTexts = (uiScene: UIScene | UiScenePhaser) => {
  const titleText: Phaser.GameObjects.Text = uiScene.add.text(20, 20, 'Title Text', { fontSize: '16px' });
  const debugText: Phaser.GameObjects.Text = uiScene.add.text(20, 50, 'Testing', { fontSize: '16px' });
  const userNameText: Phaser.GameObjects.Text = uiScene.add.text(
    20,
    80,
    `Player name: ${uiScene.registry.get('userName')}`,
    { fontSize: '16px' }
  );
  const errorText: Phaser.GameObjects.Text = uiScene.add.text(20, 110, '', {
    fontSize: '16px',
    color: 'red',
  });
  // const SELECTED_ENTITY_TITLE: Phaser.GameObjects.Text = uiScene.add.text(20, 600, 'Currently Selected: ', {
  //   fontSize: '16px',
  //   color: '#0000ff',
  //   stroke: '#004489',
  //   strokeThickness: '2'
  // });
  // const selectedEntityText: Phaser.GameObjects.Text = uiScene.add.text(20, 620, '', {
  //   fontSize: '16px',
  //   color: '#0000ff',
  //   stroke: '#004489',
  //   strokeThickness: '2'
  // });
  const tooltipText: Phaser.GameObjects.Text = uiScene.make.text({
    x: 20,
    y: 300,
    text: 'Heres a huge paragraph, words and words and words, more stuff more stuff',
    style: {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#0099ff',
      stroke: '#004489',
      align: 'left',
      wordWrap: { width: 300, useAdvancedWrap: false },
    },
  });
  overlayTexts = { titleText, debugText, userNameText, errorText, tooltipText };
  return overlayTexts;
};

const getOverlayTexts = () => overlayTexts;

export { initOverlayTexts, getOverlayTexts };
