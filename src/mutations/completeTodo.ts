import { gql } from '@apollo/client';

export const COMPLETE_TODO_MUTATION = gql`
  mutation CompleteTodo($id: ID!) {
    completeTodo(id: $id) {
      id
      text
      completed
    }
  }
`;
