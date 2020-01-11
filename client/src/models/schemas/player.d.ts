interface Player {
  id: string;
  name: string;
  color: string;
}

interface Players {
  [playerId: string]: Player;
}
type playerId = string;
// type Players = Record<playerId, Player>;
