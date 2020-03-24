import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const getModules = (data) => {
  let modules = [];
  let nodes = data.data.allFile.nodes;
  for (let item of nodes) {
    console.log('got item', item);
  }
} 

const IndexPage = (data) => {
  console.log('DATA', data.data.allFile.nodes);
  return (
    <Layout>
      <SEO title="Home" />
      <h1>FireBootCamp Angular</h1>
      <p>Welcome the the FireBootCamp angular course materials. This site provides tutorial content supporting a range of SSW training courses.</p>   
    </Layout>
  )
}


export const query = graphql`
query MyQuery {
  allFile(filter: {sourceInstanceName: { eq: "markdown" } }) {
    nodes {
      id
      name
      relativePath
      sourceInstanceName
    }
  }
}
`

export default IndexPage
