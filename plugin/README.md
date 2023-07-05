# Beehiiv Gatsby Source Plugin

This is a Gatsby source plugin for fetching newsletter posts from Beehiiv API.

## Installation

To install this plugin, you need to have Node.js and Yarn (or npm) installed on your machine.

1. Install the plugin using Yarn or npm:

   ```bash
   yarn add gatsby-source-beehiiv
   # or
   npm install gatsby-source-beehiiv
   ```

2. Add the plugin to your `gatsby-config.js` file:

   ```javascript
   module.exports = {
     plugins: [
       {
         resolve: "gatsby-source-beehiiv",
         options: {
           apiKey: process.env.BEEHIIV_API_KEY,
           pubId: process.env.BEEHIIV_PUB_ID,
         },
       },
     ],
   };
   ```

   Your Beehiiv API key and publication ID can be found in your [Beehiiv settings](https://app.beehiiv.com/settings/integrations) and should be provided via environment variables, as above. You can also provide them directly in the plugin options, but this is not recommended.

3. Run `gatsby develop` to start the development server.

## Usage

After installing and configuring the plugin, you can use the fetched newsletter posts in your Gatsby site.

For example, you can create a page that lists all the newsletter posts:

```javascript
import React from "react";
import { graphql } from "gatsby";

export const query = graphql`
  query {
    allNewsletterPost {
      nodes {
        id
        title
        content
        publish_date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;

const NewsletterPage = ({ data }) => {
  const posts = data.allNewsletterPost.nodes;

  return (
    <div>
      <h1>Newsletter Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Published on {post.publish_date}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsletterPage;
```

This page queries all the newsletter posts using the `allNewsletterPost` GraphQL query, and renders them in a list.

## Contributing

If you want to contribute to this plugin, you can follow these steps:

1. Fork this repository to your own GitHub account.
2. Create a new branch from the `main` branch.
3. Make your changes and commit them to your branch.
4. Push your branch to your GitHub account.
5. Create a pull request from your branch to the `main` branch of this repository.

## License

This plugin is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
