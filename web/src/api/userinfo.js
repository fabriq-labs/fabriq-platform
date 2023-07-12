// Source - Api
import axios from "axios";

const UserInfo = {
  updateUserInfo: (token, data, url, org) =>
    axios.post(`${url}/${org}/api/users/${data.id}`, data, {
      headers: {
        "Content-Type": "application/json",
        "META-KEY": token
      }
    }),
  verifyToken: (token, url, org) =>
    axios.get(`${url}/${org}/api/verify/${token}`),
  updateClaims: async (data, token, url, org) =>
    await axios.post(`${url}/${org}/api/user/update-claims`, data, {
      headers: {
        "Content-Type": "application/json",
        "META-KEY": token
      }
    }),
};

export default UserInfo;
