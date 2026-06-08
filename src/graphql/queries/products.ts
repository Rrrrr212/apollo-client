import { gql } from "@apollo/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface GetProductsQueryResult {
  products: Product[];
}

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      id
      name
      price
      description
    }
  }
`;
