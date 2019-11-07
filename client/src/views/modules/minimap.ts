let minimapCamera: Phaser.Cameras.Scene2D.Camera;

const initMinimapCamera = (scene): void => {
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
    .setZoom(0.1)
    .centerToSize()
    .setBackgroundColor('#222222');
  minimapCamera.scrollX = 700;
  minimapCamera.scrollY = 700;
};

const getMinimapCamera = (): Phaser.Cameras.Scene2D.Camera => minimapCamera;
export { initMinimapCamera, getMinimapCamera };
