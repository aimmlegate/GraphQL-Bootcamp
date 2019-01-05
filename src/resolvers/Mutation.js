import uuidv4 from "uuid/v4";

const Mutation = {
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

  createPost: (parent, args, { db, pubsub }, info) => {
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

    if (newPost.published) {
      pubsub.publish("post", { post: { mutation: "CREATED", data: newPost } });
    }

    return newPost;
  },

  deletePost: (parent, args, { db, pubsub }) => {
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

    if (deletedPost.published) {
      pubsub.publish("post", {
        post: { mutation: "DELETED", data: deletedPost }
      });
    }

    return deletedPost;
  },

  updatePost: (parent, args, { db, pubsub }) => {
    const { id, data } = args;
    let post = db.posts.find(pst => pst.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }
    if (typeof data.body === "string") {
      post.body = data.body;
    }
    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: { mutation: "DELETED", data: originalPost }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: { mutation: "CREATED", data: post }
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: { mutation: "UPDATED", data: post }
      });
    }

    return post;
  },

  deleteUser: (parent, args, { db }) => {
    const { id } = args;
    const userIndex = db.users.findIndex(usr => usr.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const [deletedUsers] = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(pst => {
      const isMatch = pst.author === id;

      if (isMatch) {
        db.comments = comments.filter(cmnt => cmnt.post !== pst.id);
      }

      return !isMatch;
    });

    db.comments = db.comments.filter(cmnt => cmnt.author !== id);

    return deletedUsers;
  },

  updateUser: (parent, args, { db }, info) => {
    const { id, data } = args;
    let user = db.users.find(usr => usr.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const isEmailTaken = db.users.some(usr => usr.email == data.email);
      if (isEmailTaken) {
        throw new Error("email taken");
      }
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },

  createComment: (parent, args, { db, pubsub }, info) => {
    const { author, post } = args.data;

    const isUserExist = db.users.some(usr => usr.id === author);
    const isPostExist = db.posts.some(pst => pst.id === post && pst.published);

    if (!isUserExist || !isPostExist) {
      throw new Error("User or Post not found");
    }

    const newComment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(newComment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: { mutation: "CREATED", data: newComment }
    });

    return newComment;
  },

  deleteComment: (parent, args, { db, pubsub }) => {
    const { id } = args;
    const isExist = db.comments.some(cmnt => cmnt.id === id);
    if (!isExist) {
      throw new Error("Comment not found");
    }
    const deletedComment = db.comments.find(cmnt => cmnt.id === id);

    db.comments = db.comments.filter(cmnt => cmnt.id !== id);
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: { mutation: "DELETED", data: deletedComment }
    });

    return deletedComment;
  },

  updateComment: (parent, args, { db, pubsub }) => {
    const { id, data } = args;
    let comment = db.comments.find(cmnt => cmnt.id === id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (typeof data.text === "string") {
      comment.text = data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: "UPDATE", data: comment }
    });

    return comment;
  }
};

export { Mutation as default };
