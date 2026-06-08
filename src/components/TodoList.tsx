import { gql, useQuery, useMutation } from '@apollo/client';
import { GET_TODOS_QUERY } from '../queries/getTodos';
import { COMPLETE_TODO_MUTATION } from '../mutations/completeTodo';
import { useState } from 'react';

export const TodoList = () => {
  const { data, loading, error } = useQuery(GET_TODOS_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only',
  });

  const [completeTodo] = useMutation(COMPLETE_TODO_MUTATION, {
    update(cache, { data: { completeTodo } }) {
      cache.modify({
        id: cache.identify(completeTodo),
        fields: {
          completed() {
            return true;
          },
        },
      });
    },
  });

  const [todos, setTodos] = useState(data?.todos || []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {data.todos.map((todo: any) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => completeTodo({ variables: { id: todo.id } })}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
