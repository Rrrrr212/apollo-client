import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './apollo/client';
import ProductList from './components/ProductList';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="app">
        <h1>Product List</h1>
        <ProductList />
      </div>
    </ApolloProvider>
  );
}
