import { gql } from '@apollo/client';

export const GET_TODOS_QUERY = gql`
  query GetTodos {
    todos {
      id
      text
      completed
    }
  }
`;
