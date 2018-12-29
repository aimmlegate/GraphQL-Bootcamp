import { GraphQLServer } from "graphql-yoga";

// Type def
// Scalar types - String, Boolean, Int, Float, Id

const typeDefs = `
  type Query {
    greeting(name: String): String!
    me: User!
    post: Post!
    add(a: Float, b: Float): Float!
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
    }),
    greeting: (parent, args, ctx, info) => {
      if (args.name) {
        return `Hello ${args.name}`;
      } else {
        return "Hello";
      }
    },
    add: (_, args) => {
      if (args.a && args.b) {
        return args.a + args.b;
      } else {
        return 0;
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("server up"));
