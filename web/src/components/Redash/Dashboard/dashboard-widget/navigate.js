// Navigate
import { navigate } from "@reach/router";
import { trim, isString, isUndefined } from "lodash";

function formatSimpleTemplate(str, data) {
  if (!isString(str)) {
    return "";
  }
  return str.replace(/{{\s*([^\s]+?)\s*}}/g, (match, prop) => {
    if (hasOwnProperty.call(data, prop) && !isUndefined(data[prop])) {
      return data[prop];
    }
    return match;
  });
}

const handleCLick = (data, link) => {
  if (data && data.activePayload && data.activePayload.length > 0 && link) {
    const item = data.activePayload[0].payload;
    const href = trim(formatSimpleTemplate(link, item));

    navigate(href);
  } else if (data && data.payload && link) {
    // Scatter Chart
    const href = trim(formatSimpleTemplate(link, data.payload));
    navigate(href);
  }
};

export { handleCLick };
