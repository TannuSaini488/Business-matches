const mongoose6 = require("mongoose");

const matchSchema = mongoose6.Schema(
  {
    buyer: {
      type: mongoose6.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose6.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "negotiation",
        "due-diligence",
        "closed",
        "rejected",
      ],
      default: "pending",
    },
    messages: [
      {
        sender: { type: mongoose6.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    documents: [{ type: mongoose6.Schema.Types.ObjectId, ref: "Document" }],
    tasks: [{ type: mongoose6.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

module.exports = mongoose6.model("Match", matchSchema);
