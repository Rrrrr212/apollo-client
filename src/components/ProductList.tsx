import * as React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS_QUERY } from "../graphql/queries/products.js";
import type { GetProductsQueryResult } from "../graphql/queries/products.js";

function ProductSkeleton() {
  return (
    <div className="product-grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="product-card skeleton">
          <div className="skeleton-line skeleton-name" />
          <div className="skeleton-line skeleton-price" />
          <div className="skeleton-line skeleton-description" />
        </div>
      ))}
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="error-container" role="alert">
      <p className="error-icon">⚠</p>
      <p className="error-message">请求失败：{message}</p>
      <button
        className="error-retry-btn"
        onClick={() => window.location.reload()}
      >
        重试
      </button>
    </div>
  );
}

export function ProductList() {
  const { data, loading, error } = useQuery<GetProductsQueryResult>(
    GET_PRODUCTS_QUERY
  );

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  return (
    <div className="product-grid">
      {data?.products.map((product) => (
        <div key={product.id} className="product-card">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">&yen;{product.price}</p>
          <p className="product-description">{product.description}</p>
        </div>
      ))}
    </div>
  );
}
