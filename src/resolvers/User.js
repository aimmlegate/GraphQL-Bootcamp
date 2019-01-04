const User = {
  posts: (parent, args, { db }, info) =>
    db.posts.filter(pst => pst.author === parent.id),

  comments: (parent, args, { db }, info) =>
    db.comments.filter(cmnt => cmnt.author === parent.id)
};

export { User as default };
