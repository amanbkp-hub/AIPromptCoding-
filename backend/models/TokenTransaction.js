const mongoose = require("mongoose");

const tokenTransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true
        },

        type: {
            type: String,
            enum: [
                "SESSION_START",
                "CHALLENGE_GENERATION",
                "PROMPT_EVALUATION",
                "CODE_GENERATION",
                "OTHER"
            ],
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const TokenTransaction = mongoose.model(
    "TokenTransaction",
    tokenTransactionSchema
);

module.exports = TokenTransaction;