const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            enum: ["EASY", "MEDIUM", "HARD"],
            default: "HARD"
        },

        language: {
            type: String,
            default: "Java"
        },

        inputFormat: {
            type: String,
            required: true
        },

        outputFormat: {
            type: String,
            required: true
        },

        constraints: {
            type: [String],
            default: []
        },

        examples: [
            {
                input: String,
                output: String,
                explanation: String
            }
        ],

       concepts: { type: [String], default: [] },

publicTests: [
    { input: String, expectedOutput: String }
],

hiddenTests: [
    { input: String, expectedOutput: String }
]
    },
    {
        timestamps: true
    }
);

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;