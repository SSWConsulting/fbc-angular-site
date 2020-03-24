import React from "react"
import Layout from "../components/layout"
export default ({data}) => {
    console.log('GOT PAge Data', data);
    const lessonContent = data.markdownRemark
    return (
        <Layout>
            <div>
            <div dangerouslySetInnerHTML={{ __html: lessonContent.tableOfContents }} />
              <div dangerouslySetInnerHTML={{ __html: lessonContent.html }} />
            </div>
        </Layout>
    )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      tableOfContents(maxDepth:2)
    }
  }
`