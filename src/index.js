import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

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
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Data

let users = [
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

let posts = [
  {
    id: "12434",
    title: "Fake post 1",
    body: "lorem ipsum 1",
    published: true,
    author: "123abc1"
  },
  {
    id: "124345",
    title: "Fake post 2",
    body: "lorem ipsum 2",
    published: false,
    author: "123ab2c"
  },
  {
    id: "124346",
    title: "Fake post 3",
    body: "lorem ipsum 3",
    published: true,
    author: "123ab4c"
  }
];

let comments = [
  {
    id: "c123",
    text: "comment 1",
    author: "123abc1",
    post: "12434"
  },
  {
    id: "c124",
    text: "comment 2",
    author: "123ab2c",
    post: "124345"
  },
  {
    id: "c125",
    text: "comment 3",
    author: "123abc3",
    post: "124346"
  },
  {
    id: "c126",
    text: "comment 4",
    author: "123ab4c",
    post: "12434"
  },
  {
    id: "c127",
    text: "comment 5",
    author: "123abc1",
    post: "12434"
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
    grades: (parent, args, ctx, info) => [99, 80, 92],
    comments: () => comments
  },
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const { email } = args;
      const isEmailTaken = users.some(usr => usr.email === email);
      if (isEmailTaken) {
        throw new Error("Email is taken");
      }

      const newUser = {
        id: uuidv4(),
        ...args
      };

      users.push(newUser);

      return newUser;
    },

    createPost: (parent, args, ctx, info) => {
      const { author } = args;
      const isUserExist = users.some(usr => usr.id === author);

      if (!isUserExist) {
        throw new Error("User not found");
      }

      const newPost = {
        id: uuidv4(),
        ...args
      };

      posts.push(newPost);

      return newPost;
    },

    createComment: (parent, args, ctx, info) => {
      const { author, post } = args;

      const isUserExist = users.some(usr => usr.id === author);
      const isPostExist = posts.some(pst => pst.id === post && pst.published);

      if (!isUserExist || !isPostExist) {
        throw new Error("User or Post not found");
      }

      const newComment = {
        id: uuidv4(),
        ...args
      };

      comments.push(newComment);

      return newComment;
    }
  },
  Post: {
    author: (parent, args, ctx, info) =>
      users.find(usr => usr.id === parent.author),

    comments: parent => comments.filter(cmnt => cmnt.post === parent.id)
  },
  User: {
    posts: (parent, args, ctx, info) =>
      posts.filter(pst => pst.author === parent.id),

    comments: parent => comments.filter(cmnt => cmnt.author === parent.id)
  },
  Comment: {
    author: parent => users.find(usr => usr.id === parent.author),
    post: parent => posts.find(pst => pst.id === parent.post)
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("server up"));
