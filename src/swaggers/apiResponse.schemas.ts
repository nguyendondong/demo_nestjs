export const unauthorizedResponse = {
  status: 401,
  description: "Unauthorized",
  schema: {
    type: "object",
    properties: {
      error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Password is wrong",
          },
          error: {
            type: "string",
            example: "Unauthorized",
          },
          statusCode: {
            type: "number",
            example: 401,
          },
        },
      },
      path: {
        type: "string",
        example: "/auth/login",
      },
    },
  },
};
