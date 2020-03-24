/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)


modules = [];

exports.sourceNodes = ({actions, createNodeId, createContentDigest, graphql }) => {
    // push modules data to gatsby graph

    for (let module of modules) {
        const nodeMeta = {
            id: createNodeId('module-'+module.number),
            parent: null,
            children: [],
            internal: {
                type: `Module`,
                content: JSON.stringify(module),
                contentDigest: createContentDigest(module)
            }
        };
        const node = Object.assign({}, module, nodeMeta);
        console.log('adding modules node', node);
        actions.createNode(node)
    }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
    // create a slug for each markdown file
    if (node.internal.type === `MarkdownRemark`) {
        const slug  = createFilePath({ node, getNode, basePath: `pages` })
        actions.createNodeField({node, name: 'slug', value: slug});

        // parse slug to extract module name and number
        // ie /content/module-05-CRM_App-03/ -> { '05': 'Crm App' }
        // push to a distinct array of modules
        let regex = /.*module-([\d]+)-(.+)-([\d]+)/;
        let matches = slug.match(regex);
        let module = { number: matches[1], title: matches[2].replace('_', ' ') };
        if (!modules.find(m => m.number == module.number)) {
            modules.push(module);
        }
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


