

class Game {
  constructor(room, player) {
    this.room = room;
    this.players = [player];
    this.playing = false;
    this.options = {
      isIndestructible: true
    }
  }
}

export {Game};
