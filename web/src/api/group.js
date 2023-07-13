import axios from "./axios";

const Group = {
  query: () => axios.get("api/groups")
};

export default Group;
