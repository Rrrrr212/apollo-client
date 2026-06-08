import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.example.com/graphql",
  }),
  cache: new InMemoryCache(),
});
