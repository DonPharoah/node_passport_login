interface Player {
  id: string;
  name: string;
}

interface Players {
  [playerId: string]: Player;
}

interface Units {
  [unitId: string]: import('../entities/unit').default;
}

interface Buildings {
  [buildingId: string]: import('../entities/building').default;
}
