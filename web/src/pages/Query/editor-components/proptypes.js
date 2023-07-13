/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
import { wrap } from "lodash";
import moment from "moment";

function checkMoment(isRequired, props, propName, componentName) {
  const value = props[propName];
  const isRequiredValid =
    isRequired &&
    value !== null &&
    value !== undefined &&
    moment.isMoment(value);
  const isOptionalValid =
    !isRequired &&
    (value === null || value === undefined || moment.isMoment(value));
  if (!isRequiredValid && !isOptionalValid) {
    return new Error(
      `Prop \`${propName}\` supplied to \`${componentName}\` should be a Moment.js instance.`
    );
  }
}

export const Moment = wrap(false, checkMoment);
Moment.isRequired = wrap(true, checkMoment);
