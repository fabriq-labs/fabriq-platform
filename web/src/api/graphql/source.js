/* eslint-disable import/prefer-default-export */
// Source - Graphql

// Get the Data
const REF_SOURCE = `
    query {
        ref_source (where:{is_source  :{_eq: true}}) {
            description
            group
            name
            image_url
			id
			entities
			connections {
				display_name
				id
			}
        }
    }
`;

const REF_SOURCE_CONNECTION = `
    query {
        connection {
            id
            Source{
              id
              name
            }
        }
    }
`;

const REF_CONNECTION_GET = `
	query($id: Int!, $org_id: Int){
		connection (where:{id :{_eq: $id}, org_id:{_eq: $org_id}}) {
            id
            display_name
            name
		}
	}
`;

const REF_DESTINATION = `
    query($ref_destination_id: Int!) {
        ref_destination_action (where:{ref_destination_id :{_eq: $ref_destination_id}}) {
            name
            display_name
            description
            id
            request_params
        }
    }
`;

const REF_SOURCE_GET = `
    query {
        ref_source (where:{is_target  :{_eq: true}}) {
            id
            name
            description
            is_target
            is_data_source
            connections {
				display_name
				id
                credentials
			}
            image_url
        }
    }
`;

export {
  REF_SOURCE,
  REF_DESTINATION,
  REF_SOURCE_CONNECTION,
  REF_CONNECTION_GET,
  REF_SOURCE_GET
};
