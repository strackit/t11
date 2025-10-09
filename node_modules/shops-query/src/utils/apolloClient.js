import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core/index.js';
import fetch from 'cross-fetch';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.shop.strackit.com/graphql',
    fetch
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    }
  }
});

export default client;
export { gql };
