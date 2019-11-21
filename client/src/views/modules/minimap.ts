import ClientScene from '../../scenes/clientScene';

let minimapCamera: Phaser.Cameras.Scene2D.Camera;

const initMinimapCamera = (scene: ClientScene): Phaser.Cameras.Scene2D.Camera => {
  let mainCamera = scene.cameras.main;
  minimapCamera = scene.cameras.add(
    (scene.game.config.width as number) - 200,
    (scene.game.config.height as number) - 200,
    200,
    200,
    false,
    'minimap'
  );
  let { width, height } = scene.registry.get('gameBoundary');
  minimapCamera
    .setScene(scene)
    .setScroll(width / 2 - 100, height / 2 - 100)
    .setZoom(0.049)
    .setBackgroundColor('#222222');
  // minimapCamera
  //   .setScene(scene)
  //   .setZoom(0.05)
  //   .setBackgroundColor('#222222')
  //   .centerOn(mainCamera.x, mainCamera.y)
  //   .setScroll(400, 400);
  return minimapCamera;
};

const getMinimapCamera = (): Phaser.Cameras.Scene2D.Camera => minimapCamera;
export { initMinimapCamera, getMinimapCamera };
