/* eslint-disable no-param-reassign */
import axios from "./axios";

function convertUserInfo(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profile_image_url,
    apiKey: user.api_key,
    groupIds: user.groups,
    sites: user.sites,
    isDisabled: user.is_disabled,
    isInvitationPending: user.is_invitation_pending
  };
}

const User = {
  query: (params) => axios.get("api/users", { params }),
  get: ({ id }) => axios.get(`api/users/${id}`),
  create: (data) => axios.post("api/users", data),
  save: (data) => axios.post(`api/users/${data.id}`, data),
  convertUserInfo
};

export default User;
