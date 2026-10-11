
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        // User's currently available tokens
        tokens: {
            type: Number,
            default: 5000,
            min: 0
        },

        // Maximum free tokens available per day
        dailyTokenLimit: {
            type: Number,
            default: 5000,
            min: 0
        },

        // Tracks the last daily token refill
        lastTokenRefill: {
            type: Date,
            default: Date.now
        },

        // Total challenges generated
        totalChallenges: {
            type: Number,
            default: 0
        },

        // Total challenges successfully solved
        totalSolved: {
            type: Number,
            default: 0
        },

        // Average prompt evaluation score
        averagePromptScore: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;