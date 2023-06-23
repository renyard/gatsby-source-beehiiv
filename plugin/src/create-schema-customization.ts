import { GatsbyNode } from "gatsby";

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    const { createTypes } = actions;

    createTypes(`
      type NewsletterPost implements Node {
        thumbnail: File @link(from: "fields.thumbnail")
      }`);
  };
