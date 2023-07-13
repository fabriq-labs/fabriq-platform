// Site Graphql

const SITEDETAILS = `
    query siteDetails($org_id: Int!) {
      sites(where: {org_id: {_eq: $org_id}}) {
        host_name
        site_id
        site_name
        id
      }
    }  
`;

const SITEBYID = `
  query SitebyId($id: Int!) {
    sites(where: {id: {_eq: $id}}) {
      host_name
      site_name
      site_id
      collector_url
    }
  }
`;

const CREATESITE = `
  mutation createSite($name: String!, $hostName: String!, $site_id: String!, $collector_url: String,$org_id: Int!) {
    insert_sites(objects: {host_name: $hostName, org_id: $org_id, site_id: $site_id, site_name: $name, collector_url: $collector_url}) {
      returning {
        host_name
        org_id
        site_id
        site_name
        collector_url
      }
    }
  }
`;

const UPDATESITE = `
  mutation update_edit($name: String!, $host_name: String!, $id: Int!) {
    update_sites(where: {id: {_eq: $id}}, _set: {site_name: $name, host_name: $host_name}) {
      returning {
        host_name
        id
        org_id
        site_name
        site_id
      }
    }
  }
`;

export { SITEDETAILS, CREATESITE, SITEBYID, UPDATESITE };
