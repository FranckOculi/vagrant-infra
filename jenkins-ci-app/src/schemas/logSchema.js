const bodyJsonSchema = {
  type: "object",
  required: ["type", "message", "stack", "email"],
  properties: {
    type: { type: "string" },
    message: { type: "string" },
    stack: { type: "string" },
    email: { type: "string" },
  },
};

const paramsJsonSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    domain: { type: "string" },
    per_page: { type: "string" },
    current_page: { type: "string" },
  },
};

export const postLogSchema = {
  body: bodyJsonSchema,
};

export const getLogSchema = {
  query: paramsJsonSchema,
};
