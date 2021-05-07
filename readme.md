# Social Comments
Node based apis for socialcomment internship. 

Project made by <a href="https://itsrajat.xyz">Rajat Shrivastava</a>

Follow the below instruction to correctly setup and run the project.

## Pre-requisites
<p>Node 14.x installed. Download it from <a href="https://nodejs.org/en/">here</a></p>
    
## Cloning the project

Run the following command to clone the project

```
git clone https://github.com/rajat-0206/socialcomments
```

## Setting up the project

- In the root of the project make a new file called <strong> .env </strong>.
- Copy the code from <a href="https://github.com/rajat-0206/socialcomments/blob/main/.sample.env">sample.env</a> into your <strong>.env</strong> file.
- Fill in all the values in your <strong>.env</strong> file.
- Now install the dependencies required for the project. From the root of the project run the following command.

    ```
    npm install
    ```    
## Running the project

To run and test the project, run the following command from root of the project.

```
node index.js
```
Additionally, if you have nodemon installed in your pc, then you can run the following command to start the server
```
nodemon serve
```
Now visit localhost:5000 to check if project is running successfully.


## REST API DOCUMENTATION

<p>Documentation for the rest apis start here. These apis are in correspondence with the document given to me.
</p>
<p>The auth token generated in the login api can be sent via header by placing it in <strong>bearer token</strong> or can be passed in the request body. If both header and request body contains the token, the preference is given to request body.</p>

## Register User

### Request

`POST https://socialcomments.herokuapp.com/signup`

    {
        "email": "<some valid email address>",
        "password": "<should be atleast 5 character long and shoul contain one upper case, one lower case, one number and one special character>",
        "name": "<a valid string>",
        "gender": <single character. should be one of these - M/F/O>
    }

### Response
```
{
    "id":"<created user id>"
}
```

## Login

### Request

`POST https://socialcomments.herokuapp.com/login`

    {
        "email": "<some valid email address>",
        "password": "<should be atleast 5 character long and shoul contain one upper case, one lower case, one number and one special character>",
    }

### Response
```
{
    "id":"<created user id>",
    "token":"<token for user verification>"
}
```
The token recieved in this api is valid for 4 hours. The token can be sent via request body or as bearer token in request header.



## Create Post  

### Request

`POST https://socialcomments.herokuapp.com/createPost`

    {
        "title": "<some valid string>",
        "content": "<some valid string>",
        "tags":"['array of strings']" ( optional ),
        "token":"<auth token>"
    }

### Response
```
{
    "id":"<created post id>",
}
```


## Like or dislike post
If the post is already liked the api will dislike the post and vice versa.
### Request

`POST https://socialcomments.herokuapp.com/likepost`

    {
        "postid": "<some valid post id>",
        "token":"<auth token>"
    }

### Response
```
{
    "response": "Post was liked"
}

or

{
    "response": "Post was disliked"
}
```

## Create Comments

### Request

`POST https://socialcomments.herokuapp.com/addComment`

    {
        "postid": "<some valid string>",
        "comment":"<some valid string for comment>",
        "token":"<auth token>"
    }

### Response
```
"Comment was successfully posted"
```


## Get all liked post with users who liked it

### Request

`GET https://socialcomments.herokuapp.com/likepost`

    {
        "token":"<auth token>"
    }

### Response
```
{
    "response": [
        {
            "post_id": "<some post id>",
            "created_by": "<some email>",
            "post_title": "<some title>",
            "post_content": "<some content>",
            "likedBy": [
                {
                    "name": "<some name>",
                    "user_id": "<some user id>"
                }
            ]
        }
    ]
}
```


## Get all user commented post

### Request

`GET https://socialcomments.herokuapp.com/getUserComments`

    {
        "token":"<auth token>"
    }

### Response
```
{
    "response": [
        {
            "post_id": "<some postid>",
            "created_by": "<some email>",
            "post_title": "<some post title>",
            "post_content": "<some content>",
            "comment": [
                {
                    "email": "<some email>",
                    "comment": "<the comment>",
                    "postid": "<some post id>",
                    "created": "Fri May 07 2021 14:03:46 GMT+0530 (India Standard Time)"
                }
            ]
        }
    ]
}
```
