const QUERY_FOLDER_LIST = `
    query QueryFolder {
        query_folder {
            id
            name
        }
    }
`;

const QUERY_DELETE_UPDATE = `
mutation deleteQuery($id: Int!, $org_id: Int!) {
    update_queries(where: {id: {_eq: $id}, org_id: {_eq: $org_id}}, _set: {is_deleted: true}) {
      returning {
        id
        is_deleted
      }
    }
  }
`;

export {QUERY_FOLDER_LIST, QUERY_DELETE_UPDATE};