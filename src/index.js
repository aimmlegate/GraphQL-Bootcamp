import { GraphQLServer } from "graphql-yoga";

// Type def

const typeDefs = `
  type Query {
    hello: String!
  }
`;

// Resolvers

const resolvers = {
  Query: {
    hello: () => "Hello World"
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("server up"));
