export const SortType = {
  TIME: 'sort-time',
  PRICE: 'sort-price',
  DAY: 'sort-day',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const PointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  TRANSPORT: 'transport',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const MenuItem = {
  ADD_NEW_POINT: 'ADD_NEW_POINT',
  POINTS: 'POINTS',
  STATISTICS: 'STATISTICS',
};

export const ChartSettings = {
  TYPE: 'horizontalBar',
  COLOR: {
    WHITE: '#ffffff',
    BLACK: '#000000',
  },
  ANCHOR: {
    START: 'start',
    END: 'end',
  },
  ALIGN: 'start',
  TEXT: {
    MONEY: 'MONEY',
    TYPE: 'TYPE',
    TIME_SPEND: 'TIME-SPEND',
  },
  TITLE_POSITION: 'left',
  TICKS_PADDING: 5,
  DATA_FONT_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  TICKS_FONT_SIZE: 13,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  FLAG: {
    TRUE: true,
    FALSE: false,
  },
};

export const OfflineMessage = {
  LOADING: 'Loading failure. Try again later.',
  CREATE: 'You cannot create point offline',
  CONNECTION: 'Connection lost',
  EDIT: 'You cannot edit point offline',
  DELETE: 'You cannot delete point offline',
};

export const State = {
  DISABLED: 'disabled',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
};

export const ButtonName = {
  CLOSE: 'Close',
  SAVE: 'Save',
  DELETE: 'Delete',
};

export const EvtKey = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const ErrorMessage = {
  REPLACE: 'Cannot replace unexisting elements',
  REMOVE: 'Can remove only components',
  UPDATE: 'Cannot update unexisting point',
  DELETE: 'Cannot delete unexisting point',
};
