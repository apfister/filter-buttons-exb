import { ImmutableObject } from "seamless-immutable";

export interface Config {
  configuredButtons: Array<any>;
  useMapWidgetIds: Array<any>;
  jimuLayerViewInfo: null;
  buttonMargins: any;
  buttonSize: string;
  buttonType: string;
}

export type IMConfig = ImmutableObject<Config>;
