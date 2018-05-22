class LevelGenerator {
  public static generate() {
    return new Promise((resolve, reject) => {
      const level = [];
      const levelLength: number = Math.random() * 500;
      for (let i = 0; i < levelLength; i++) {
        level.push({ x: i, y: i, z: 1 });
      }
      resolve(level);
    });
  }
}
