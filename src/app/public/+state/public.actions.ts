import { Action } from '@ngrx/store';

export enum PublicActionType {
  SetVisited = '[public] SetVisited',
}

export class SetVisited implements Action {
  readonly type = PublicActionType.SetVisited;
  constructor() {}
}

export type PublicAction =
  SetVisited
;
