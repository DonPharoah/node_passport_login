function findInGroupById(group: Phaser.GameObjects.Group, id: string): Phaser.GameObjects.GameObject {
  let isFound = group.children.getArray().find((gameObject: Phaser.GameObjects.GameObject) => {
    return gameObject.name === id;
  });
  return isFound;
}

export { findInGroupById };
