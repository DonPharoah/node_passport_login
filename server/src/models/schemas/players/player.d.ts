interface Player {
  id: string;
  username: string;
  color: string;
}

interface Players {
  [playerId: string]: Player;
}
