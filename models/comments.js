

class Comment{
    constructor(email,comment,postid){
        this.email = email;
        this.comment = comment;
        this.postid = postid;
        this.created=Date();  
    }
};

module.exports = new Comment();