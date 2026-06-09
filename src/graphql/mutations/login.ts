import type { TypedDocumentNode } from "@apollo/client";
import { gql } from "graphql-tag";

export interface LoginMutationData {
  login: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface LoginMutationVariables {
  email: string;
  password: string;
}

export const LOGIN_MUTATION: TypedDocumentNode<
  LoginMutationData,
  LoginMutationVariables
> = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;
