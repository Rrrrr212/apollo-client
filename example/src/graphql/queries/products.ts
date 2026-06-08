import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface GetProductsData {
  products: Product[];
}

export const GET_PRODUCTS_QUERY: TypedDocumentNode<GetProductsData> = gql`
  query GetProducts {
    products {
      id
      title
      description
      price
      image
    }
  }
`;
