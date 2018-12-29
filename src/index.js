import { GraphQLServer } from "graphql-yoga";

// Type def
// Scalar types - String, Boolean, Int, Float, Id

const typeDefs = `
  type Query {
    greeting(name: String): String!
    me: User!
    posts(query: String): [Post!]!
    add(array: [Int!]!): Float!
    grades: [Int!]!
    users(query: String): [User!]!
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

// Data

const users = [
  {
    id: "123abc1",
    name: "Andrew 1",
    email: "aaa@aaa.aa"
  },
  {
    id: "123ab2c",
    name: "Andrew 2",
    email: "aaa@aaa.aa",
    age: 22
  },
  {
    id: "123abc3",
    name: "Andrew 3",
    email: "aaa@aaa.aa",
    age: 23
  },
  {
    id: "123ab4c",
    name: "Andrew 4",
    email: "aaa@aaa.aa",
    age: 21
  }
];

const posts = [
  {
    id: "12434",
    title: "Fake post 1",
    body: "lorem ipsum 1",
    published: true
  },
  {
    id: "124345",
    title: "Fake post 2",
    body: "lorem ipsum 2",
    published: false
  },
  {
    id: "124346",
    title: "Fake post 3",
    body: "lorem ipsum 3",
    published: true
  }
];

// Resolvers

const resolvers = {
  Query: {
    users: (_, args) => {
      if (!args.query) {
        return users;
      }
      return users.filter(usr =>
        usr.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    me: () => ({
      id: "123abc",
      name: "Andrew",
      email: "aaa@aaa.aa",
      age: 23
    }),
    posts: (_, args) => {
      if (!args.query) {
        return posts;
      }
      return posts.filter(
        pst =>
          pst.title.toLowerCase().includes(args.query.toLowerCase()) ||
          pst.body.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    greeting: (parent, args, ctx, info) => {
      if (args.name) {
        return `Hello ${args.name}`;
      }
      return "Hello";
    },
    add: (_, args) => {
      if (args.array) {
        return args.array.reduce((acc, v) => acc + v, 0);
      }
      return 0;
    },
    grades: (parent, args, ctx, info) => [99, 80, 92]
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("server up"));
