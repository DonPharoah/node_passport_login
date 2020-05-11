interface Player {
  id: string;
  username: string;
  color: string;
}

interface Players {
  [playerId: string]: Player;
}
type playerId = string;
// type Players = Record<playerId, Player>;
