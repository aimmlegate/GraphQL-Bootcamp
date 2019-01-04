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

const db = {
  users,
  posts,
  comments
};

export default db;
