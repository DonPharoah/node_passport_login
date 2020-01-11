type Building = import('../../entities/building').default;

interface Buildings {
  [buildingId: string]: Building;
}
