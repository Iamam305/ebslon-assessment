import mongoose, { Schema, model, models } from "mongoose";

const user_schema = new Schema({
    user_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_profile:{
    type: String,
    
  }
});

export const User =  model("User", user_schema);
