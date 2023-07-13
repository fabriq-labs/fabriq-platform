// Action - Api
import axios from "../axios";

const ContentQuery = {
  query: (id, parameters) =>
    axios.post(`api/queries/${id}/results`, {
      id: id,
      parameters: parameters
    })
};

export default ContentQuery;
