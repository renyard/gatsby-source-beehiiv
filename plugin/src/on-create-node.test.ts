import { createRemoteFileNode } from "gatsby-source-filesystem";

var mockCreateRemoteFileNode;

jest.mock("gatsby-source-filesystem", () => {
  mockCreateRemoteFileNode = jest.fn();
  return {
    createRemoteFileNode: mockCreateRemoteFileNode,
  };
});

import { onCreateNode } from "./on-create-node";

describe("onCreateNode", () => {
  const createNode = jest.fn();
  const createNodeField = jest.fn();
  const createNodeId = jest.fn();
  const getCache = jest.fn();

  const node = {
    id: "123",
    internal: {
      type: "NewsletterPost",
    },
    thumbnail_url: "https://example.com/image.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateRemoteFileNode.mockResolvedValue({
      id: "test-file-node-id",
    });
  });

  it("should create a remote file node and add a thumbnail field to the node", async () => {
    await onCreateNode({
      node,
      actions: { createNode, createNodeField },
      createNodeId,
      getCache,
    });

    expect(createRemoteFileNode).toHaveBeenCalledWith({
      url: node.thumbnail_url,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      getCache,
    });

    expect(createNodeField).toHaveBeenCalledWith({
      node,
      name: "thumbnail",
      value: "test-file-node-id",
    });
  });

  it("should not create a remote file node if the thumbnail_url is null", async () => {
    const createRemoteFileNode = jest.fn();

    await onCreateNode({
      node: { ...node, thumbnail_url: null },
      actions: { createNode, createNodeField },
      createNodeId,
      getCache,
    });

    expect(createRemoteFileNode).not.toHaveBeenCalled();
    expect(createNodeField).not.toHaveBeenCalled();
  });

  it("should not create a remote file node if the node type is not NewsletterPost", async () => {
    const createRemoteFileNode = jest.fn();

    await onCreateNode({
      node: { ...node, internal: { type: "OtherType" } },
      actions: { createNode, createNodeField },
      createNodeId,
      getCache,
    });

    expect(createRemoteFileNode).not.toHaveBeenCalled();
    expect(createNodeField).not.toHaveBeenCalled();
  });
});
