// Datasource - Graphql
const REF_DATASOURCE = `
    query($org_id: Int!) {
        data_sources (where:{org_id :{_eq: $org_id}}) {
            id
            name
            type
            queue_name
            scheduled_queue_name
            created_at
        }   
    }
`;

export { REF_DATASOURCE };
