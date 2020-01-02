import React, { useEffect, useState } from "react"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"

const Model = ({ url }) => {
  const [model, setModel] = useState()

  useEffect(() => {
    new STLLoader().load(url, geometry => {
      setModel(geometry)
    })
  }, [url])

  console.log(model)
  return model ? <mesh geometry={model} /> : null
}

export default Model
