require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
module.exports = {
  siteMetadata: {
    title: `typesense-demo-example`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    {
      resolve: "gatsby-source-sanity",
      options: {
        projectId: process.env.GATSBY_SANITY_PROJECT_ID,
        dataset: process.env.GATSBY_SANITY_DATASET,
      },
    },
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: process.env.GATSBY_GA_TRACKING_ID,
      },
    },
    "gatsby-plugin-image",
    {
      resolve: `gatsby-plugin-typesense`,
      options: {
        rootDir: `${__dirname}/public`, // Required
        collectionSchema: {
          // Required
          name: "resorts",
          fields: [
            {
              name: "name",
              type: "string",
              facet: true,
            },
            {
              name: "numberOfRooms",
              type: "float",
            },
            // {
            //   name: "description",
            //   type: "string",
            // },
            {
              name: "tags",
              type: "string[]",
              optional: true,
              facet: true,
            },
            { name: "location", type: "string", optional: true },
            {
              name: "page_path", // Required
              type: "string",
              optional: true,
            },
            {
              name: "page_priority_score", // Required
              type: "int32",
              optional: true,
            },
          ],
          default_sorting_field: "numberOfRooms", // Required
        },
        server: {
          // Required
          apiKey: "xyz",
          nodes: [
            {
              host: "localhost",
              port: "8108",
              protocol: "http",
            },
          ],
        },
      },
    },
  ],
};
