import { GraphQLServer } from "graphql-yoga";

// Type def
// Scalar types - String, Boolean, Int, Float, Id

const typeDefs = `
  type Query {
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers

const resolvers = {
  Query: {
    me: () => ({
      id: "123abc",
      name: "Andrew",
      email: "aaa@aaa.aa",
      age: 23
    }),
    post: () => ({
      id: "12434aaas",
      title: "Fake post",
      body: "lorem ipsum",
      published: true
    })
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("server up"));
