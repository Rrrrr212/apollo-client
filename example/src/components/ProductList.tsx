import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS_QUERY } from '../graphql/queries/products';
import type { Product } from '../graphql/queries/products';

export default function ProductList() {
  const { loading, error, data } = useQuery(GET_PRODUCTS_QUERY);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="product-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="product-skeleton">
            <div className="skeleton-image" />
            <div className="skeleton-title" />
            <div className="skeleton-price" />
          </div>
        ))}
      </div>
    );
  }

  const products = data?.products ?? [];

  return (
    <div className="product-grid">
      {products.map((product: Product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.title} className="product-image" />
          <h3 className="product-title">{product.title}</h3>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
