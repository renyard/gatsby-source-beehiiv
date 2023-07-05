import { sourceNodes } from "./source-nodes";

describe("sourceNodes", () => {
  const mockGatsbyApi = {
    reporter: {
      info: jest.fn(),
    },
    createNodeId: jest.fn(() => "test-node-id"),
    createContentDigest: jest.fn(() => "test-content-digest"),
    actions: {
      createNode: jest.fn(),
    },
  };

  const apiKey = "test-api-key";
  const pubId = "test-pub-id";

  const mockFetch = (data: any, ok = true) =>
    jest.fn().mockResolvedValue({
      ok,
      json: jest.fn().mockResolvedValue(data),
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch posts and create nodes", async () => {
    const mockResponse = {
      data: [
        { id: 1, title: "Test Post 1", publish_date: 1000 },
        { id: 2, title: "Test Post 2", publish_date: 2000 },
      ],
      total_pages: 1,
    };
    global.fetch = mockFetch(mockResponse);

    // @ts-ignore
    await sourceNodes(mockGatsbyApi, { apiKey, pubId }, null);

    // expect(mockGatsbyApi.reporter.info).toHaveBeenCalledWith(
    //   "[beehiiv] Fetching page 1 of posts..."
    // );
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.beehiiv.com/v2/publications/${pubId}/posts?expand%5B%5D=free_web_content&stats&limit=10&page=1&status=confirmed`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    expect(mockGatsbyApi.createNodeId).toHaveBeenCalledTimes(2);
    expect(mockGatsbyApi.createContentDigest).toHaveBeenCalledTimes(2);
    expect(mockGatsbyApi.actions.createNode).toHaveBeenCalledTimes(2);
    expect(mockGatsbyApi.actions.createNode).toHaveBeenCalledWith({
      ...mockResponse.data[0],
      id: "test-node-id",
      parent: null,
      children: [],
      internal: {
        type: "NewsletterPost",
        contentDigest: "test-content-digest",
      },
    });
    expect(mockGatsbyApi.actions.createNode).toHaveBeenCalledWith({
      ...mockResponse.data[1],
      id: "test-node-id",
      parent: null,
      children: [],
      internal: {
        type: "NewsletterPost",
        contentDigest: expect.any(String),
      },
    });
  });

  it("should filter out posts with publish date in the future", async () => {
    const mockResponse = {
      data: [
        { id: 1, title: "Test Post 1", publish_date: 1000 },
        { id: 2, title: "Test Post 2", publish_date: 32503680000000 },
      ],
      total_pages: 1,
    };
    global.fetch = mockFetch(mockResponse);

    // @ts-ignore
    await sourceNodes(mockGatsbyApi, { apiKey, pubId }, null);

    expect(mockGatsbyApi.actions.createNode).toHaveBeenCalledTimes(1);
    expect(mockGatsbyApi.actions.createNode).toHaveBeenCalledWith({
      ...mockResponse.data[0],
      id: expect.any(String),
      parent: null,
      children: [],
      internal: {
        type: "NewsletterPost",
        contentDigest: "test-content-digest",
      },
    });
  });

  it("should throw an error if the response is not ok", async () => {
    global.fetch = mockFetch({}, false);

    await expect(
      // @ts-ignore
      sourceNodes(mockGatsbyApi, { apiKey, pubId }, null)
    ).rejects.toThrow("HTTP error! Status: undefined");
  });
});
