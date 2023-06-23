import { createRemoteFileNode } from "gatsby-source-filesystem";

export const onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  getCache,
}) => {
  if (node.internal.type === "NewsletterPost" && node.thumbnail_url !== null) {
    const fileNode = await createRemoteFileNode({
      url: node.thumbnail_url,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      getCache,
    });

    if (fileNode) {
      createNodeField({ node, name: "thumbnail", value: fileNode.id });
    }
  }
};
