import { GraphQLServer } from "graphql-yoga";

// Type def
// Scalar types - String, Boolean, Int, Float, Id

const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean
  }
`;

// Resolvers

const resolvers = {
  Query: {
    title: () => "Lopata",
    price: () => 1234,
    releaseYear: () => 2007,
    rating: () => 8.3,
    inStock: () => true
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("server up"));
