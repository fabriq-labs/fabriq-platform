const GET_ORG_LOGO = `
  query($id: Int!) {
    organizations(where: {id: {_eq: $id}}) {
      name
      logo
      slug
    }
  }
`;

export { GET_ORG_LOGO };
