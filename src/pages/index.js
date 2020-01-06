import React from "react"
import { Link } from "gatsby"
import { Canvas } from "react-three-fiber"
import Layout from "../components/layout"
import SEO from "../components/seo"

import "./style.css"
import Model from "../components/Model"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Canvas
      shadowMap
      camera={{
        far: 2000,
        fov: 35,
        near: 0.1,
      }}
    >
      <ambientLight args={[0xffffff]} />
      <hemisphereLight args={[0x443333, 0x111122]} />
      <Model url="/heath-pickle.stl" />
    </Canvas>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
