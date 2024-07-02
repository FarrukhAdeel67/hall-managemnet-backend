import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
    },
});

export const Email = mongoose.model("Email", schema);
