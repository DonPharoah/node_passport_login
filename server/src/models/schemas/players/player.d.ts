interface Player {
  id: string;
  name: string;
  color: string;
}

interface Players {
  [playerId: string]: Player;
}
