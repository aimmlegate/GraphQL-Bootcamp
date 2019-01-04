import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import db from "./db";

// Resolvers

const resolvers = {
  Query: {
    users: (parent, args, { db }) => {
      if (!args.query) {
        return users;
      }
      return db.users.filter(usr =>
        usr.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    me: () => ({
      id: "123abc",
      name: "Andrew",
      email: "aaa@aaa.aa",
      age: 23
    }),
    posts: (parent, args, { db }) => {
      if (!args.query) {
        return db.posts;
      }
      return db.posts.filter(
        pst =>
          pst.title.toLowerCase().includes(args.query.toLowerCase()) ||
          pst.body.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    comments: (parent, args, { db }) => db.comments
  },
  Mutation: {
    createUser: (parent, args, { db }, info) => {
      const { email } = args.data;
      const isEmailTaken = db.users.some(usr => usr.email === email);
      if (isEmailTaken) {
        throw new Error("Email is taken");
      }

      const newUser = {
        id: uuidv4(),
        ...args.data
      };

      db.users.push(newUser);

      return newUser;
    },

    createPost: (parent, args, { db }, info) => {
      const { author } = args.data;
      const isUserExist = db.users.some(usr => usr.id === author);

      if (!isUserExist) {
        throw new Error("User not found");
      }

      const newPost = {
        id: uuidv4(),
        ...args.data
      };

      db.posts.push(newPost);

      return newPost;
    },

    deletePost: (parent, args, { db }) => {
      const { id } = args;
      const isPostExist = db.posts.some(pst => pst.id === id);

      if (!isPostExist) {
        throw new Error(" Post not found");
      }

      const deletedPost = db.posts.find(pst => pst.id === id);
      db.posts = db.posts.filter(pst => {
        const isMatch = pst.id === id;
        if (isMatch) {
          db.comments = db.comments.filter(cmnt => cmnt.post !== pst.id);
        }
        return !isMatch;
      });

      return deletedPost;
    },

    deleteUser: (parent, args, { db }) => {
      const { id } = args;
      const userIndex = db.users.findIndex(usr => usr.id === id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const deletedUsers = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter(pst => {
        const isMatch = pst.author === id;

        if (isMatch) {
          db.comments = comments.filter(cmnt => cmnt.post !== pst.id);
        }

        return !isMatch;
      });

      db.comments = db.comments.filter(cmnt => cmnt.author !== id);

      return deletedUsers[0];
    },

    createComment: (parent, args, { db }, info) => {
      const { author, post } = args.data;

      const isUserExist = db.users.some(usr => usr.id === author);
      const isPostExist = db.posts.some(
        pst => pst.id === post && pst.published
      );

      if (!isUserExist || !isPostExist) {
        throw new Error("User or Post not found");
      }

      const newComment = {
        id: uuidv4(),
        ...args.data
      };

      db.comments.push(newComment);

      return newComment;
    },

    deleteComment: (parent, args, { db }) => {
      const { id } = args;
      const isExist = db.comments.some(cmnt => cmnt.id === id);
      if (!isExist) {
        throw new Error("Comment not found");
      }
      const deletedComment = db.comments.find(cmnt => cmnt.id === id);
      db.comments = db.comments.filter(cmnt => cmnt.id !== id);
      return deletedComment;
    }
  },
  Post: {
    author: (parent, args, { db }, info) =>
      db.users.find(usr => usr.id === parent.author),

    comments: (parent, { db: { comments } }) =>
      db.comments.filter(cmnt => cmnt.post === parent.id)
  },
  User: {
    posts: (parent, args, { db }, info) =>
      db.posts.filter(pst => pst.author === parent.id),

    comments: (parent, args, { db }, info) =>
      db.comments.filter(cmnt => cmnt.author === parent.id)
  },
  Comment: {
    author: (parent, args, { db }, info) =>
      db.users.find(usr => usr.id === parent.author),
    post: (parent, args, { db }, info) =>
      db.posts.find(pst => pst.id === parent.post)
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db
  }
});

server.start(() => console.log("server up"));
