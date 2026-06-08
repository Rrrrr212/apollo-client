import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const COMPLETE_TODO_MUTATION = gql`
  mutation CompleteTodo($id: ID!) {
    completeTodo(id: $id) {
      id
      completed
    }
  }
`;

interface CompleteTodoVariables {
  id: string;
}

export function useCompleteTodo() {
  const [completeTodo, { loading, error }] = useMutation<
    { completeTodo: { id: string; completed: boolean } },
    CompleteTodoVariables
  >(COMPLETE_TODO_MUTATION, {
    update(cache, { data }) {
      if (!data?.completeTodo) return;

      const todoId = cache.identify({
        __typename: "Todo",
        id: data.completeTodo.id,
      });

      if (!todoId) return;

      cache.modify({
        id: todoId,
        fields: {
          completed() {
            return true;
          },
        },
      });
    },
  });

  return { completeTodo, loading, error };
}
