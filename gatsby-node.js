/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

// build a list of modules 
const modules = [];

exports.sourceNodes = ({actions, createNodeId, createContentDigest, graphql }) => {
    console.log('SourceNodes');
}

exports.onCreateNode = ({ node, getNode, actions }) => {
    // create a slug for each markdown file
    if (node.internal.type === `MarkdownRemark`) {
        const slug  = createFilePath({ node, getNode, basePath: `pages` })
        actions.createNodeField({node, name: 'slug', value: slug});
    }
}

// query slugs to create pages
exports.createPages = async ({ graphql, actions }) => {
    // **Note:** The graphql function call returns a Promise
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
    const slugs = await graphql(`
      query {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `);
    console.log('GOT SLUGS',slugs);
    slugs.data.allMarkdownRemark.edges.forEach(({ node }) => {
        actions.createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/lesson.js`),
          context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      })
  }


