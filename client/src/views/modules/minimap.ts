import ClientScene from '../../scenes/clientScene';

let minimapCamera: Phaser.Cameras.Scene2D.Camera;

const initMinimapCamera = (scene: ClientScene): void => {
  let mainCamera = scene.cameras.main;
  minimapCamera = scene.cameras.add(
    (scene.game.config.width as number) - 200,
    (scene.game.config.height as number) - 200,
    200,
    200,
    false,
    'mainScene'
  );
  minimapCamera
    .setScene(scene)
    .setZoom(0.05)
    .setBackgroundColor('#222222')
    .centerOn(mainCamera.x, mainCamera.y)
    .setScroll(400, 400);
};

const getMinimapCamera = (): Phaser.Cameras.Scene2D.Camera => minimapCamera;
export { initMinimapCamera, getMinimapCamera };
