interface Selectable {
  selectedEvent: () => Selectable;
  deselectedEvent: () => Selectable;
}
