const e = require("express"),
{ObjectId} = require('mongodb'),
  { Posts } = require("../db");


class Comment{
    constructor(email,comment,postid){
        this.email = email;
        this.comment = comment;
        this.postid = postid;
        this.created=Date();  
    }
};
class Post{

    async postExist(postid){
        let doc =  await Posts().findOne({_id:ObjectId(postid)});
        if(doc){
            return true;
        }
        else{
            return false;
        }
      }

    async addLike(email,postid){
        let data = await Posts().findOne({_id:ObjectId(postid)});
        let likes = data.likes;
        let message = "";
        if(likes.includes(email)){
            likes = likes.filter((ele)=>ele!==email);
            message = "Post was disliked";   
        }
        else{
            likes.push(email);
            message = "Post was liked";
        }
        let res = await Posts().findOneAndUpdate({_id:ObjectId(postid)},{$set:{likes:likes}});
        return res.ok==1?message:"Some unknown error happened. Cannot update like";

    }

    async addComment(email,postid,comment){
        if(!comment){
            return "Comment is required";
        }
        // let data = await Posts().findOne({_id:ObjectId(postid)});
        // let comments = data.comments;
        let newcomment = new Comment(email,comment,postid);
        // comment.push(newcomment);
        let res = await Posts().findOneAndUpdate({_id:ObjectId(postid)},{$push:{comments:newcomment}});
        return res.ok==1?"Comment was successfully posted":"Some unknown error happened. Cannot update like";
    }


    async createPost(email,title,content,tags){
        if(!title && !content){
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
                created: Date(),
              });
              return res.insertedCount==1?{"id":res.ops[0]._id}:{"response":"Some unknown error occured"};
        }
        else{
            return {"response":"Title and content are required"};
        }
    }

}

module.exports = new Post();