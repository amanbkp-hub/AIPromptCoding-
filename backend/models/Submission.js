const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
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

        language: {
            type: String,
            default: "Java"
        },

        code: {
            type: String,
            required: true
        },

        publicTestsPassed: {
            type: Number,
            default: 0
        },

        publicTestsTotal: {
            type: Number,
            default: 0
        },

        hiddenTestsPassed: {
            type: Number,
            default: 0
        },

        hiddenTestsTotal: {
            type: Number,
            default: 0
        },

        executionTime: {
            type: Number,
            default: 0
        },

        memoryUsed: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["RUNNING", "PASSED", "FAILED", "ERROR"],
            default: "RUNNING"
        },

        errorMessage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model(
    "Submission",
    submissionSchema
);

module.exports = Submission;