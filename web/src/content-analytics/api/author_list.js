// Author List
import axios from "../../api/axios";
import { AUTHOR_LIST } from "../api/graphql/author_list";

const AuthorList = {
  get_Author_list: (site_id, period_date, period_month, period_year, offset) =>
    axios.post("/api/pipeline/graphql", {
      query: AUTHOR_LIST,
      variables: {
        site_id,
        period_date,
        period_month,
        period_year,
        offset
      }
    })
};

export { AuthorList };
