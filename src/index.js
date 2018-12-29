import { GraphQLServer } from "graphql-yoga";

// Type def

const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

// Resolvers

const resolvers = {
  Query: {
    hello: () => "Hello World",
    name: () => "Andrey Lukin",
    location: () => "Russia",
    bio: () => "Fuck you"
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("server up"));
