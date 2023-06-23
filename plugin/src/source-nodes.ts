import type { GatsbyNode, NodeInput, SourceNodesArgs } from "gatsby";
import { NODE_TYPES } from "./constants";
import { NodeBuilderInput } from "./types";

export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  gatsbyApi,
  { apiKey, pubId }
) => {
  let posts = [];
  let page = 1;

  const auth = ["Bearer", apiKey].join(" ");

  while (true) {
    gatsbyApi.reporter.info(`[beehiiv] Fetching page ${page} of posts...`);
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/posts?expand%5B%5D=free_web_content&stats&limit=10&page=${page}&status=confirmed`,
      {
        headers: {
          Authorization: auth,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data = [], total_pages = page } = await response.json();

    posts.push(...data);

    if (page === total_pages) {
      break;
    }
    page++;
  }

  posts = posts.filter(
    (post) => post.publish_date <= Math.floor(new Date().getTime() / 1000)
  );

  for (const post of posts) {
    nodeBuilder({
      gatsbyApi,
      input: { type: NODE_TYPES.NewsletterPost, data: post },
    });
  }
};

interface INodeBuilderArgs {
  gatsbyApi: SourceNodesArgs;
  input: NodeBuilderInput;
}

export function nodeBuilder({ gatsbyApi, input }: INodeBuilderArgs) {
  const id = gatsbyApi.createNodeId(`${input.type}-${input.data.id}`);

  const node = {
    ...input.data,
    id,
    parent: null,
    children: [],
    internal: {
      type: input.type,
      contentDigest: gatsbyApi.createContentDigest(input.data),
    },
  } satisfies NodeInput;

  gatsbyApi.actions.createNode(node);
}
