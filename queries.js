const findUser = "SELECT * FROM people WHERE email = $1";

const addUser =
  "INSERT INTO people (email, password, username, id) VALUES ($1, $2, $3, $4)";

const addPost =
  "INSERT INTO posts (tweet, date_time, id) VALUES ($1, $2, $3) RETURNING postid";

const getPost =
  "SELECT posts.postid, posts.tweet, posts.date_time, posts.id, posts.verified, people.username, people.email FROM posts JOIN people ON posts.id = people.id ORDER BY posts.date_time desc";

const addMedia = "INSERT INTO media (file, postid) VALUES ($1, $2)";

const getMedia =
  "SELECT media.postid, media.file FROM media JOIN posts ON media.postid = posts.postid";

// const getPostWithMedia =
// "SELECT people.username,people.email,posts.postid, posts.tweet, posts.date_time, posts.id, posts.verified,media.file FROM people INNER JOIN posts ON people.id = posts.idINNER JOIN media ON posts.postid = media.postid";

const getPostWithMedia =
"SELECT people.username,people.email,posts.postid, posts.tweet, posts.date_time, posts.id, posts.verified,posts.isbookmarked, posts.likes, posts.isLiked, media.file FROM people INNER JOIN posts ON people.id = posts.id LEFT JOIN media ON posts.postid = media.postid ORDER BY posts.date_time DESC;"

const findUserinBookmark = "SELECT * FROM posts WHERE userid = $1";

const addUserinBookmark = "INSERT INTO bookmark (postid, userid) VALUES ($1, $2)";

const updateBookmark = "UPDATE posts SET isbookmarked = $1 WHERE postid = $2";

const getLikes = "SELECT likes FROM posts WHERE postid = $1";

const updateLikes = "UPDATE posts SET likes = $2 WHERE postid = $1";

const getPostidForBookMark = "SELECT people.username,people.email,posts.postid, posts.tweet, posts.date_time, posts.id, posts.verified, posts.isbookmarked, posts.isLiked, media.file FROM people INNER JOIN posts ON people.id = posts.id LEFT JOIN media ON posts.postid = media.postid WHERE (people.id = $1 AND posts.isbookmarked = true) ORDER BY posts.date_time DESC;";

const getBookmarks = "SELECT people.username,people.email,posts.*,media.file FROM bookmark JOIN posts ON bookmark.postid = posts.postid JOIN people ON posts.id = people.id LEFT JOIN media ON posts.postid = media.postid WHERE bookmark.postid = $1 ";

module.exports = {
  findUser,
  addUser,
  addPost,
  getPost,
  addMedia,
  getMedia,
  getPostWithMedia,
  findUserinBookmark,
  addUserinBookmark,
  updateBookmark,
  getBookmarks,
  getPostidForBookMark,
  updateLikes,
  getLikes
};
