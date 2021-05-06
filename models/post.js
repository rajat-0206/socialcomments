const e = require("express"),
  { Posts } = require("../db");


class Comment{
    constructor(email,comment){
        this.email = email;
        this.comment = comment;
        created:Date().now()    
    }
};
class Post{

    async postExist(postid){
        let doc =  await Posts().findOne({postid});
        if(doc){
            return true;
        }
        else{
            return false;
        }
      }

    async addLike(email,post){
        let data = await Posts().findOne({postid});
        console.log(data[0]);
        likes = data[0].likes;
        console.log(likes.push(email));
        return "Updated";
    //     likes.push(email);
    //    let res = await Posts().update({postid},{data});

    }
    async createPost(email,title,content,tags){
        if(title!="" && content!=""){
            let comments = Array();
            let likes = Array();
            if(!tags){
                var tags = Array();
            }
            const res = await Posts().insertOne({
                email,
                title,
                content,
                tags,
                comments,
                likes,
                created: Date.now(),
              });
              return res.insertedCount==1?{"id":res.ops[0]._id}:{"response":"Some unknown error occured"};
        }
        else{
            return {"response":"Title and content are required"};
        }
    }

}

module.exports = new Post();