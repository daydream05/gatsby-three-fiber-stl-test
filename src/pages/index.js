import React from "react"
import { Link } from "gatsby"
import { Canvas } from "react-three-fiber"
import Layout from "../components/layout"
import SEO from "../components/seo"

import "./style.css"
import Model from "./Model"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Canvas camera={[0, 5, 0]}>
      <Model url="/heath-pickle.stl" />
    </Canvas>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
