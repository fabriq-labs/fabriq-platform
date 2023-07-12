// Pipelines - Graphql

const REF_PIPELINE = `
query($org_id: Int!) {
    pipeline (where:{org_id :{_eq: $org_id}, is_deleted:{_eq: false}}, order_by: {id: desc}) {
		id
		name
		description
		last_ran_at
		status
		created_by
		source{
		  id
		  name
		  image_url
		}
		entities_count
		entities
	}	
   }
`;

const REF_PIPELINE_LOG = `
    query($pipeline_id: Int!, $org_id: Int){
        log_pipeline (where:{pipeline_id :{_eq: $pipeline_id}, org_id:{_eq: $org_id}}, order_by: {id: desc}){
            id
            status
            activity_name
            triggered_by
			created_at
			started_at
			completed_at
			details
			job_id
			target_record_count
        }
    }
`;

const REF_PIPELINE_VIEW = `
	query($id: Int!, $org_id: Int){
		pipeline (where:{id :{_eq: $id}, org_id:{_eq: $org_id}}) {
			id
			name
			description
			last_ran_at
			created_at
			status
			source {
			  id
			  name
			  image_url
			  app_config
			  connections {
				display_name
				id
			  }
			}
			destination {
				name
			}
			connection {
				credentials
			}
			org {
				external_mapping
			}
			entities
			config
			entities
			sync_from
			sync_frequency
			is_receipe
			connection_id
			transform_url
			transform
			entities_count
			tenant_id
			destination_id
			external_mapping
		}
	}
`;

const REF_PIPELINE_STATUS_UPDATE = `
	mutation update_pipeline($id: Int!, $status:Boolean!, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {status: $status}) {
			returning{
				id
				status
			}
		}
	}
`;

const REF_PIPELINE_CONFIG_UPDATE = `
	mutation update_pipeline($id: Int!, $config: jsonb, $entities: jsonb, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {config: $config, entities: $entities, entities_count: 1}) {
			returning{
				id
				config
				entities
				entities_count
			}
		}
	}
`;

const REF_PIPELINE_CONFIGDATA_UPDATE = `
	mutation update_pipeline($id: Int!, $config: jsonb, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {config: $config}) {
			returning{
				id
				config
			}
		}
	}
`;

const REF_PIPELINE_NAME_UPDATE = `
	mutation update_pipeline($id: Int!, $name: String, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {name: $name}) {
			returning{
				id
				name
			}
		}
	}
`;

const REF_PIPELINE_DELETE_UPDATE = `
	mutation update_pipeline($id: Int!, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {is_deleted: true}) {
			returning{
				id
				is_deleted
			}
		}
	}
`;

const REF_PIPELINE_LAST_RUN_AT_UPDATE = `
	mutation update_pipeline($id: Int!, $last_ran_at: timestamptz!) {
		update_pipeline(where: {id: {_eq: $id}}, _set: {last_ran_at: $last_ran_at}) {
	  		returning {
				id
				name
	  		}
		}
  	}  
`;

const REF_PIPELINE_INSERT = `
	mutation insert_pipeline($name: String!, $description: String, $source_id: Int, $entities: jsonb, $org_id: Int, $user_id: Int, $destination_id: Int, $entities_count: Int) {
		insert_pipeline(objects:
		{
			name: $name,
			description: $description,
			source_id: $source_id,
			created_by: $user_id,
			tenant_id: 1,
			status: false,
			destination_id: $destination_id,
			config: {},
			entities: $entities,
			sync_from: "",
			sync_frequency: "",
			org_id: $org_id,
			entities_count: $entities_count
		}
		) {
			returning {
				id
				name
				description
				last_ran_at
				status
				org_id
				source {
					id
					name
					image_url
					entities
				}
				config
				entities
				sync_from
				sync_frequency
				entities_count
			}
		}
	}
`;

const REF_DUPLICATE_PIPELINE_INSERT = `
	mutation insert_pipeline($name: String!, $description: String, $source_id: Int, $entities: jsonb, $org_id: Int, $user_id: Int, $destination_id: Int, $entities_count: Int, $status: Boolean, $is_receipe: Boolean, $tenant_id: Int, $transform: String, $transform_url: String, $sync_frequency: String, $sync_from: String, $connection_id: Int, $config: jsonb) {
		insert_pipeline(objects:
		{
			name: $name,
			description: $description,
			source_id: $source_id,
			created_by: $user_id,
			tenant_id: $tenant_id,
			status: $status,
			destination_id: $destination_id,
			entities: $entities,
			sync_from: $sync_from,
			sync_frequency: $sync_frequency,
			org_id: $org_id,
			entities_count: $entities_count
			is_receipe: $is_receipe
			transform: $transform
			transform_url: $transform_url
			connection_id: $connection_id
			config: $config
		}
		) {
			returning {
				id
				name
				description
				last_ran_at
				status
				org_id
				source {
					id
					name
					image_url
					entities
				}
				config
				entities
				sync_from
				sync_frequency
				entities_count
				destination_id
				is_receipe
				tenant_id
				transform
				transform_url
				connection_id
			}
		}
	}
`;

export {
  REF_PIPELINE,
  REF_PIPELINE_LOG,
  REF_PIPELINE_VIEW,
  REF_PIPELINE_STATUS_UPDATE,
  REF_PIPELINE_INSERT,
  REF_PIPELINE_DELETE_UPDATE,
  REF_PIPELINE_CONFIG_UPDATE,
  REF_PIPELINE_CONFIGDATA_UPDATE,
  REF_PIPELINE_NAME_UPDATE,
  REF_DUPLICATE_PIPELINE_INSERT,
  REF_PIPELINE_LAST_RUN_AT_UPDATE
};
