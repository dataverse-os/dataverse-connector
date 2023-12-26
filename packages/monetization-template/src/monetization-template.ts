import { Datatoken } from "./data-token";
import { DataUnion } from "./data-union";
import { Lit } from "./lit";

const lit = new Lit();

export class MonetizationTemplate {
  datatoken: Datatoken;
  dataUnion: DataUnion;

  constructor() {
    this.datatoken = new Datatoken(lit);
    this.dataUnion = new DataUnion(lit);
  }
}
