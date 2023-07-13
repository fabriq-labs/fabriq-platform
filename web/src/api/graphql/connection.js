/* eslint-disable import/prefer-default-export */
// Connection - Graphql

const REF_PIPELINE = `
	query($id: Int!, $org_id: Int){
		pipeline (where:{id :{_eq: $id}, org_id:{_eq: $org_id}}) {
			id
			name
			description
			last_ran_at
			status
			source {
			  id
			  name
			  image_url
			  connections {
				display_name
				id
			  }
			}
			connection {
				display_name
				credentials
				id
				config
			}
			entities
			config
			entities
			sync_from
			sync_frequency
		}
	}
`;

const REF_PIPELINE_UPDATE = `
	mutation update_pipeline($id: Int!, $connection_id: Int, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: { connection_id: $connection_id }) {
			returning{
				id
				connection_id
			}
		}
	}
`;

// Update the data
const REF_PIPELINE_ENTITIES_UPDATE = `
	mutation update_pipeline($id: Int!, $entities: jsonb, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {entities: $entities}) {
			returning{
				id
				entities
			}
		}
	}
`;

const REF_INSERT_CONNECTION = `
	mutation insert_connection($display_name: String!, $credentials: jsonb, $source_id: Int, $org_id: Int) {
		insert_connection (objects:
		{
			display_name: $display_name,
			credentials: $credentials,
			source_id: $source_id,
			org_id: $org_id
		}
		) {
			returning {
				display_name
				credentials
				id
			}
		}
	}
`;

const REF_INSERT_CONNECTION_WITH_CONFIG = `
	mutation insert_connection($display_name: String!, $credentials: jsonb, $source_id: Int, $org_id: Int, $config: jsonb) {
		insert_connection (objects:
		{
			display_name: $display_name,
			credentials: $credentials,
			source_id: $source_id,
			org_id: $org_id,
			config: $config
		}
		) {
			returning {
				display_name
				credentials
				id
				config
			}
		}
	}
`;

export {
  REF_PIPELINE,
  REF_PIPELINE_UPDATE,
  REF_PIPELINE_ENTITIES_UPDATE,
  REF_INSERT_CONNECTION,
  REF_INSERT_CONNECTION_WITH_CONFIG
};
