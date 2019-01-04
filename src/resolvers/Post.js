const Post = {
  author: (parent, args, { db }, info) =>
    db.users.find(usr => usr.id === parent.author),

  comments: (parent, { db: { comments } }) =>
    db.comments.filter(cmnt => cmnt.post === parent.id)
};

export { Post as default };
