export const enum Events {
  NEW_UNIT_ADDED = 'newUnitAdded',
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  PING_EVENT = 'pingEvent',
  PONG_EVENT = 'pongEvent',
  CHANGE_NAME = 'changeName',
  CHANGE_NAME_OK = 'changeNameOK',
  GET_ALL_USER_NAMES = 'getAllUserNames',
  PLAYER_DISCONNECTED = 'playerDisconnected',
  ISSUE_UNIT_COMMAND = 'issueUnitCommand',
  SERVER_STATUS_UPDATE = 'serverStatusUpdate',
  ERROR_STATUS = 'errorStatus',
  PLAYER_CONSTRUCT_BUILDING = 'playerConstructBuilding',
  PLAYER_ISSUE_COMMAND = 'playerIssueCommand'
}
