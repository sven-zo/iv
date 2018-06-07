class LevelGenerator {
  public static readonly chunkLength = 20;

  public static generateChunk(startingX: number) {
    const chunk: BoxData[] = [];

    for (let i = 0 + startingX; i < this.chunkLength + startingX; i++) {
      chunk.push(new BoxData(i, -6, 1));
      chunk.push(new BoxData(i, 6, 1));
      chunk.push(new BoxData(i, Math.random() * 12 - 6, 1));
    }
    return chunk;
  }
}
