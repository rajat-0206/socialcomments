const e = require("express");
const  Joi = require("joi"),
  { Users } = require("../db");

class User{
  validateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword(pw){
    return /[A-Z]/       .test(pw) &&
    /[a-z]/       .test(pw) &&
    /[0-9]/       .test(pw) &&
    /[^A-Za-z0-9]/.test(pw) &&
    pw.length > 4;
  }

  validateName(name){
   const re =  /^[a-zA-Z]+ [a-zA-Z]+$/;
   return re.test(String(name).toLowerCase());
  }

  validateGender(gender){
    return gender=="M" || gender=="F" || gender=="O"?true:false;
  }

  async userExist(email){
    let doc =  await Users().findOne({email});
    if(doc){
        return true;
    }
    else{
        return false;
    }
  }

  async validateUser(user = {email,password,name,gender}){
    let userPresent = await this.userExist(user.email);
     if(!this.validateEmail(user.email)){
         return "Email is not valid";
     }
     else if(!this.validatePassword(user.password)){
         return "Password is not valid";
     }
     else if(!this.validateName(user.name)){
         return "Name is not valid";
     }
     else if(!this.validateGender(user.gender)){
         return "Gender is not valid";
     }
     else if(userPresent){
         return "User with this email already exist. Please choose a new one";
     }
     else{
         return true;
     }
  }
}
  
module.exports = new User();