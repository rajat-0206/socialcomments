const { response } = require("express");

const express = require("express"),
  bcrypt = require('bcrypt'),
  app = express(),
  User = require('./models/user'),
  Socialpost = require("./models/post"),
  { connectToDB, Users, Posts } = require("./db");

const encrypt = async (plaintext) => {
  return await bcrypt.hash(plaintext, 10);
}

const verifyPass = async (userpass, storedpass) => {
  return await bcrypt.compare(userpass, storedpass);
}

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
connectToDB((err, dbname) => {
  if (err) return console.log(err);
  console.log(`Connected to ${dbname}`)


  app.get("/", (req, res) => {
    return res.send("Yayyy your are successfully connected to the project");
  })

  app.post("/signup", async (req, result) => {
    data = await User.validateUser(req.body);
    if (data == true) {
      let { email, password, name, gender } = req.body;
      password = await encrypt(password);
      const res = await Users().insertOne({
        email,
        password,
        name,
        gender,
        created: Date(),
      });
      console.log(res.insertedCount);
      return res.insertedCount == 1 ? result.json({ "id": res.ops[0]._id }) : result.json({ "response": "Some unknown error occured" });
    }
    else {
      return res.json({ "response": data });
    }
  });

  app.post("/login", async (req, result) => {
    let { email, password } = req.body;
    chkUser = await User.userExist(email);
    if (chkUser) {
      let data = await Users().findOne({ email });
      chkcred = await verifyPass(password, data.password);
      if (chkcred) {
        return result.json({ "id": data._id, "token": "" });
      }
      else {
        result.send("Login failed. Please check you credentials")
      }
    }
    else {
      result.send("No such user found");
    }
  });

  app.post("/createPost", async (req, result) => {
    let { email, title, content, tags } = req.body;
    chkUser = await User.userExist(email);
    if (chkUser) {
      postCreated = await Socialpost.createPost(email, title, content, tags);
      result.json(postCreated);
    }
    else {
      result.json({ "response": "User authentication failed" });
    }
  })

  app.post("/likepost", async (req, result) => {
    let { email, postid } = req.body;
    chkUser = await User.userExist(email);
    if (chkUser) {
      chkPost = await Socialpost.postExist(postid);
      if (chkPost) {
        likePost = await Socialpost.addLike(email, postid);
        result.json(likePost);
      }
      else {
        result.json({ "response": "No such post exist" });
      }
    }
    else {
      result.json({ "response": "User authentication failed" });
    }
  });


  app.post("/addComment", async (req, result) => {
    let { email, postid, comment } = req.body;
    chkUser = await User.userExist(email);
    if (chkUser) {
      chkPost = await Socialpost.postExist(postid);
      if (chkPost) {
        commentPost = await Socialpost.addComment(email, postid, comment);
        result.json(commentPost);
      }
      else {
        result.json({ "response": "No such post exist" });
      }
    }
    else {
      result.json({ "response": "User authentication failed" });
    }
  });
});

app.get("/getLikedPosts", async (req, res) => {
  let allpost = await Posts().find({}).toArray();
  let response = await Promise.all(allpost.map(async (post) => {
    if (post.likes.length != 0) {
      let postdic = { "post_id": post._id, "created_by": post.email, "post_title": post.title, "post_content": post.content, "likedBy": Array() }
      postdic.likedBy = await Promise.all(post.likes.map(async (email) => {
        let details = await Users().findOne({ email });
        let temp = { "name": details.name, "comment_id": details._id };
        return temp;
      })
      )
      return postdic;
    }

  })
  )
  res.json({ "response": response });
});


app.get("/getUserComments", async (req, res) => {
  let { email } = req.body;
  chkUser = await User.userExist(email);
  if (chkUser) {
    let allpost = await Posts().find({}).toArray();
    let response = Array();
allpost.forEach((post) => {
      if (post.comments.length != 0 && post.comments.some((ele)=>ele.email==email)) {
        let postdic = { "post_id": post._id, "created_by": post.email, "post_title": post.title, "post_content": post.content, "comment": Array() }

        post.comments.forEach((comment) => {
          if (comment.email == email) {
            postdic.comment.push(comment);
          }
        })
        response.push(postdic);
      }
     
    })
    res.json({ "response": response });
  }
  else{
    result.json({ "response": "User authentication failed" });
  }
  
});



const server_port = 5000,
  server_host = "localhost";

app.listen(server_port, server_host, () => {
  console.log(`Server on ${server_host}:${server_port}`)
});