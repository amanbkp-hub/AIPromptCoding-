const mongoose = require("mongoose");

const promptAttemptSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        userPrompt: {
            type: String,
            required: true
        },

        evaluation: {
            objective: {
                type: Number,
                default: 0
            },

            approach: {
                type: Number,
                default: 0
            },

            constraints: {
                type: Number,
                default: 0
            },

            edgeCases: {
                type: Number,
                default: 0
            },

            outputRequirements: {
                type: Number,
                default: 0
            },

            implementation: {
                type: Number,
                default: 0
            },

            overallScore: {
                type: Number,
                default: 0
            }
        },

        status: {
            type: String,
            enum: ["NOT_READY", "READY"],
            default: "NOT_READY"
        },

        aiFeedback: {
            type: String,
            default: ""
        },

        missingInformation: {
            type: [String],
            default: []
        },

        tokensUsed: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const PromptAttempt = mongoose.model(
    "PromptAttempt",
    promptAttemptSchema
);

module.exports = PromptAttempt;