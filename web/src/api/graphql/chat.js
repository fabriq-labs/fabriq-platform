export const CHAT_TYPES = `
    query {
        org_chat_models_mapping {
          id
            chat_model {
              id
              name
              type
            }
        
          }
    }  
`;

export const CHAT_OPTIONS = `
    query {
      chat_models {
        type
        name
        id
    }
    }  
`;
