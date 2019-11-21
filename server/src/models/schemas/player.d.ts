interface PlayerSchema {
  id: string;
  name: string;
  color: string;
}

interface Players {
  [playerId: string]: PlayerSchema;
}

interface Units {
  [unitId: string]: import('../entities/unit').default;
}

interface Buildings {
  [buildingId: string]: import('../entities/building').default;
}
