interface Player {
  playerId: string;
  playerName: string;
}

interface Players {
  [playerData: string]: Player;
}
