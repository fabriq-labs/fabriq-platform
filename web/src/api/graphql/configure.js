/* eslint-disable import/prefer-default-export */
// Configure - Graphql

const REF_PIPELINE_UPDATE = `
	mutation update_pipeline($id: Int!, $sync_from: String, $sync_frequency: String,
		$entities: jsonb, $transform: String, $transform_url: String, $destination_id: Int, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {sync_from: $sync_from, sync_frequency: $sync_frequency, entities: $entities,
			transform: $transform, transform_url: $transform_url, destination_id: $destination_id }) {
			returning{
				id
				sync_from
				sync_frequency
				entities
				transform
				transform_url,
				destination_id
			}
		}
	}
`;

const REF_PIPELINE = `
	query($id: Int!, $org_id: Int){
		pipeline (where:{id :{_eq: $id}, org_id:{_eq: $org_id}}) {
			id
			name
			description
			last_ran_at
			status
			destination_id
			source{
			  id
			  name
			  image_url
			}
			destination {
				name
			}
			connection {
				credentials
			}
			entities
			config
			entities
			sync_from
			sync_frequency
			transform
      		transform_url
			external_mapping
		}
	}
`;

const REF_PIPELINE_ENTITIES_COUNT_UPDATE = `
	mutation update_pipeline($id: Int!, $entities_count: Int, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {entities_count: $entities_count}) {
			returning{
				id
				entities_count
			}
		}
	}
`;

export {
  REF_PIPELINE,
  REF_PIPELINE_UPDATE,
  REF_PIPELINE_ENTITIES_COUNT_UPDATE
};
