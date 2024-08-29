const pool = require("../../Database/db");
const query = require("../../queries");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dufddpcxp",
  api_key: "391797573693833",
  api_secret: "tKM3OaXT60rMHAyc_b6CUudj28E",
});

const upload = async (localPath, postid, id, username, res) => {
  try {
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    console.log(response);
    pool.query(query.addMedia, [response.url, postid], (err, result) => {
      if (err) throw err;
      return res.json({
        status: "success",
        code: 200,
        message: "Tweet Created",
        id,
        username,
        url: response.url,
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const createPost = (req, res) => {
  const t_tweet = req.body.t_tweet;
  const email = req.body.email;
  const file = req.files;
  const date_time = new Date();

  // console.log(file);

  pool.query(query.findUser, [email], (err, result) => {
    if (err) throw err;

    const id = result.rows[0].id;
    const username = result.rows[0].username;

    pool.query(query.addPost, [t_tweet, date_time, id], (err, result) => {
      if (err) throw err;

      if (file.length > 0) {
        file.map((el) =>
          upload(el.path, result.rows[0].postid, id, username, res)
        );
      } else {
        return res.json({
          status: "success",
          code: 200,
          message: "Tweet Created",
          id,
          username,
        });
      }
    });
  });
};

const getPost = (req, res) => {
  pool.query(query.findUser, [req.body.email], (err, result) => {
    if (err) throw err;

    // const id = result.rows[0].id;
    // const username = result.rows[0].username;
    // const email = req.body.email;

    // console.log(result.rows);

    pool.query(query.getPost, (err, result) => {
      if (err) throw err;

      if (result.rows.length === 0) {
        return res.json({
          status: "success",
          code: 404,
          message: ["No post to show"],
        });
      } else {
        res.json({
          status: "success",
          code: 200,
          message: result.rows,
        });
      }

      // console.log(result.rows);
    });
  });
};

const getPostWithMedia = (req, res) => {
  pool.query(query.getPostWithMedia, (err, result) => {
    if (err) throw err;

    if (result.rows.length === 0) {
      return res.json({
        status: "success",
        code: 404,
        message: ["No post to show"],
      });
    } else {
      // console.log(result.rows);
      res.json({
        status: "success",
        code: 200,
        message: result.rows,
      });
    }
  });
};

const getMedia = (req, res) => {
  pool.query(query.getPost, (err, result) => {
    if (err) throw err;

    return res.json({
      status: "success",
      code: 200,
      message: result.rows,
    });
  });
};

const updateBookmark = (req, res) => {
  const postid = req.body.postid;
  const click = req.body.click;
  // console.log("userid in update: ", userid);
  pool.query(query.updateBookmark, [click, postid], (err, result) => {
    if (err) throw err;

    return res.json({
      status: "success",
      code: 200,
      message: []
    });
  });
};

const updateLikes = (req, res) => {
  const postid = req.body.postid;
  const likeClick = req.body.likeClick;
  // console.log("postid in update: ", postid);
  pool.query(query.getLikes, [postid], (err, result) => {
    if(err) throw err;

    const likes = result.rows[0].likes;
    // console.log("likes: ", likes);
    const totalLikes = (likeClick === true) ? (likes === null ? 0 : likes + 1) : ((likes === null || likes == 0) ? 0 : likes - 1);

    pool.query(query.updateLikes, [postid, totalLikes], (err, result) => {
      if (err) throw err;
  
      return res.json({
        status: "success",
        code: 200,
        message: []
      });
    });

  })
};

const getBookmarks = async (req, res) => {
  try {
    const userid = req.query.userid;
    console.log("userid in bookmark: ", userid);

    const result = await pool.query(query.getPostidForBookMark, [userid]);

    if (result.rows.length === 0) {
      return res.json({
        status: "success",
        code: 401,
        message: result.rows,
      });
    }

    let arr = [];
    for (const el of result.rows) {
      arr.push(el);
    }

    console.log("arr: ", arr);
    return res.json({
      status: "success",
      code: 200,
      message: arr,
    });
  } catch (error) {
    console.error("Error in getBookmarks:", error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  createPost,
  getPost,
  getMedia,
  getPostWithMedia,
  updateBookmark,
  getBookmarks,
  updateLikes
};
