class LevelGenerator {
  public static generateChunk(
    startingXCoords: number,
    startingYCoords: number
  ) {
    const chunk: Slice[] = [];
    const chunkLength = 20;
    const startingSlice: Slice = new Slice(
      startingXCoords,
      startingYCoords,
      1,
      4
    );
    for (let i = startingXCoords; i < chunkLength + startingXCoords; i++) {
      if (i === startingXCoords) {
        chunk.push(this._generateSlice(startingSlice));
      } else {
        chunk.push(this._generateSlice(chunk[chunk.length - 1]));
      }
    }
    return chunk;
  }

  private static _generateSlice(previousSlice: Slice): Slice {
    const s = previousSlice;
    const n = Math.floor(Math.random() * 3);
    switch (n) {
      // Up
      case 0:
        return new Slice(s.x + 1, s.y + 1, 1, 4);
      // Down
      case 1:
        return new Slice(s.x + 1, s.y - 1, 1, 4);
      // Straight ahead
      case 2:
        return new Slice(s.x + 1, s.y, 1, 4);
    }
    return new Slice(s.x + 1, s.y, 1, 4);
  }
}
