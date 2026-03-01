const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String, 
      required: true 
    },

    role: { 
      type: String, 
      enum: ["sender", "receiver"], 
      required: true 
    },

    type: { 
      type: String 
    },

    location: { 
      type: String 
    },

    // ✅ NEW FIELD ADDED PROPERLY
    verified: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
