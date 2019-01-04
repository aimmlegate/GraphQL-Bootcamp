const Comments = {
  author: (parent, args, { db }, info) =>
    db.users.find(usr => usr.id === parent.author),
  post: (parent, args, { db }, info) =>
    db.posts.find(pst => pst.id === parent.post)
};

export { Comments as default };
