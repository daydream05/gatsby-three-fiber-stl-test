import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import DropZone, { Loading } from "../components/Dropzone"

const InstantQuote = () => (
  <Layout>
    <SEO  />
    <h1>Instant Quote</h1>
    <DropZone />
  </Layout>
)

export default InstantQuote
