interface PlayerSchema {
  id: string;
  name: string;
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
