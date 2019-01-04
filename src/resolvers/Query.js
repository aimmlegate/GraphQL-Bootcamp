const Query = {
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
};

export { Query as default };
