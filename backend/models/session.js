const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true
        },

        tokenBudget: {
            type: Number,
            default: 2000
        },

        tokensUsed: {
            type: Number,
            default: 0
        },

        tokensRemaining: {
            type: Number,
            default: 2000
        },

        promptScore: {
            type: Number,
            default: 0
        },

        understandingScore: {
            type: Number,
            default: 0
        },

        generatedCode: {
            type: String,
            default: ""
        },

        language: {
            type: String,
            default: "Java"
        },

        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED", "EXPIRED"],
            default: "ACTIVE"
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;