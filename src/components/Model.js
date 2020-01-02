import React, { useEffect, useState, useRef } from "react"
import * as THREE from 'three'
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { useThree, useRender, extend } from "react-three-fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })
const Controls = (props) => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useRender(() => ref.current.update())
  
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />
}

const Model = ({ url }) => {
  const [model, setModel] = useState()

  useEffect(() => {
    new STLLoader().load(url, geometry => {
      setModel(geometry)
      console.log(getVolume(geometry))
      geometry.center()
      const bb = geometry.boundingBox
      const object3DWidth = bb.max.x - bb.min.x
      const object3DHeight = bb.max.y - bb.min.y
      const object3DDepth = bb.max.z - bb.min.z
      console.log({
        depth: object3DDepth,
        width: object3DWidth,
        height: object3DHeight,
      })
    })
  }, [url])

  return model ? (
    <mesh
      geometry={model}
      scale={[1, 1, 1]}
      rotation={[Math.PI / -2, 0, Math.PI / -2]}
      receiveShadow
      castShadow
    >
      <meshPhongMaterial
        attach="material"
        color="#272727"
        specular={0x101010}
      />
      <Controls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
    </mesh>
  ) : null
}

const getVolume = (geometry) => {
  let position = geometry.attributes.position
  let faces = position.count / 3
  let sum = 0
  let p1 = new THREE.Vector3(),
      p2 = new THREE.Vector3(),
      p3 = new THREE.Vector3()
  
  for (let i = 0; i < faces; i++) {
    p1.fromBufferAttribute(position, i * 3 + 0);
    p2.fromBufferAttribute(position, i * 3 + 1);
    p3.fromBufferAttribute(position, i * 3 + 2);
    sum += signedVolumeOfTriangle(p1, p2, p3)
  }

  return sum
}

const signedVolumeOfTriangle = (p1, p2, p3) => {
  return p1.dot(p2.cross(p3)) / 6.0;
}

export default Model
