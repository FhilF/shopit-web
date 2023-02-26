const { z } = require("zod");

exports.reviewSchema = z.object({
  reviews: z.array(
    z.object({
      _id: z.string(),
      variationId: z.string().nullable().optional(),
      rate: z
        .number({
          required_error: "Enter your rate",
          invalid_type_error: "Enter your rate",
        })
        .optional(),
      comment: z
        .string()
        .max(150, "Max length is only 120 characters")
        .optional(),
    })
  ),
});
