import { gql, type ApolloCache } from "@apollo/client";

const COMPLETE_TODO_MUTATION = gql`
  mutation CompleteTodo($id: ID!) {
    completeTodo(id: $id) {
      id
      completed
    }
  }
`;

interface CompleteTodoData {
  completeTodo: {
    id: string;
    completed: boolean;
  };
}

interface CompleteTodoVariables {
  id: string;
}

function completeTodoUpdate(
  cache: ApolloCache,
  { data }: { data?: CompleteTodoData | null }
) {
  if (!data?.completeTodo) return;

  const { id, completed } = data.completeTodo;

  cache.modify({
    id: cache.identify({ __typename: "Todo", id }),
    fields: {
      completed: () => completed,
    },
  });
}

export { COMPLETE_TODO_MUTATION, completeTodoUpdate };
export type { CompleteTodoData, CompleteTodoVariables };
