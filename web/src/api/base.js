/* eslint-disable class-methods-use-this */
// Base Api
import client from "../client";

export default class BaseApi {
  constructor() {
    this._client = client;
    this._masterPath = "/";
  }

  _getDateValue(dateVal) {
    if (!dateVal) {
      return null;
    }

    if (dateVal instanceof Date) {
      return dateVal;
    }

    if (typeof dateVal.toDate === "function") {
      return dateVal.toDate();
    }

    return null;
  }
}
