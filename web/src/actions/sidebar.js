// Sidebar
import ActionTypes from "../action-types";

export function updateActiveMenu(payload) {
  return {
    type: ActionTypes.UPDATE_SIDEBARMENU,
    payload
  };
}

export function updateQueryActiveMenu(payload) {
  return {
    type: ActionTypes.UPDATE_QUERY_SIDEBARMENU,
    payload
  };
}

export function updateMainMenu(payload) {
  return {
    type: ActionTypes.UPDATE_QUERY_SIDEBARMAINMENU,
    payload
  };
}

export function updateQueryFolder(payload) {
  return {
    type: ActionTypes.QUERY_FOLDER_UPDATE,
    payload
  };
}

export function refreshActiveMenu() {
  return {
    type: ActionTypes.REFRESH_SIDEBARMENU
  };
}

