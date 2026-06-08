import React from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_TODOS_QUERY = gql`
  query GetTodos {
    todos {
      id
      text
      completed
    }
  }
`;

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface GetTodosData {
  todos: Todo[];
}

function TodoList() {
  const { loading, error, data } = useQuery<GetTodosData>(GET_TODOS_QUERY, {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-only",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.todos.map((todo) => (
        <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
