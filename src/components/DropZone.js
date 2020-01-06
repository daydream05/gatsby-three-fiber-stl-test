import React, { useCallback, useState, useEffect } from "react"
import * as THREE from 'three'
import { useDropzone } from "react-dropzone"
import { a, useTransition } from 'react-spring'
import './dropzone.css'
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import LoadingRing from "./LoadingRing"
import base64ArrayBuffer from "../utils/base64ArrayBuffer"

const calculatePrice = (volume) => {
  // volume in millimeters cubed
  const pricePerGram = 1.25 / 1000
  const minimumPrice = 10.00

  const price = (volume * pricePerGram)

  let finalPrice

  if(price < minimumPrice) {
    finalPrice = price + minimumPrice
  } else {
    finalPrice = price
  }

  return finalPrice.toFixed(2)
}

const getVolume = geometry => {
  let position = geometry.attributes.position
  let faces = position.count / 3
  let sum = 0
  let p1 = new THREE.Vector3(),
    p2 = new THREE.Vector3(),
    p3 = new THREE.Vector3()

  for (let i = 0; i < faces; i++) {
    p1.fromBufferAttribute(position, i * 3 + 0)
    p2.fromBufferAttribute(position, i * 3 + 1)
    p3.fromBufferAttribute(position, i * 3 + 2)

    sum += signedVolumeOfTriangle(p1, p2, p3)
  }

  return sum
}

const signedVolumeOfTriangle = (p1, p2, p3) => {
  return p1.dot(p2.cross(p3)) / 6.0
}

const getModelDimensions = geometry => {
  // needs geometry buffer object
  const bb = geometry.boundingBox
  const object3DWidth = bb.max.x - bb.min.x
  const object3DHeight = bb.max.y - bb.min.y
  const object3DDepth = bb.max.z - bb.min.z
  return {
    depth: object3DDepth,
    width: object3DWidth,
    height: object3DHeight,
  }
}

export const Loading = () => {
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    THREE.DefaultLoadingManager.onStart = () => {
      setLoading(true)
    }

    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setLoading(false)
    }
  }, [])

  return isLoading ? (
    <div>
      <span>Analyzing</span>
      <LoadingRing />
    </div>
  ) : null
}

function DropZone() {
  const [modelAttributes, setModelAttributes] = useState({
    volume: 0,
    dimensions: {
      depth: 0,
      width: 0,
      height: 0,
    },
    name: "",
    fileSize: 0,
  })

  const [isRejected, rejectFile] = useState(false) 

  const onDrop = useCallback(acceptedFiles => {
    console.log('it got dropped')
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      const maxFileSize = 1000 * 1000 * 100 // 100 Mb
      console.log(file.size)
      if (file.size > maxFileSize) {
        console.log("File bigger than 100Mb")
        reader.abort()
        rejectFile(true)
      } else {
        reader.readAsDataURL(file)
      }

      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = () => {
        // Do whatever you want with the file contents
        const result = reader.result


        const fileExtension = file.name.split(".").slice(-1)[0].toLowerCase()

        if (fileExtension === "stl") {
          new STLLoader().load(result, geometry => {
            // computes the geometry's bounding box
            // needed to calculate dimensions
            geometry.center()

            const dimensions = getModelDimensions(geometry)
            const volume = getVolume(geometry)

            setModelAttributes({
              volume,
              dimensions,
              name: file.name,
              fileSize: file.size,
            })

          })
        } else if (fileExtension === "obj") {
          new OBJLoader().load(result, geometry => {
            // computes the geometry's bounding box
            // needed to calculate dimensions
            if (geometry.type === "Group") {
              const geo = geometry.children[0].geometry
              geo.center()
              const dimensions = getModelDimensions(geo)
              const volume = getVolume(geo)
              setModelAttributes({
                volume,
                dimensions: dimensions,
                name: file.name,
                fileSize: file.size,
              })
            }
          })
        }
      }
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  console.log(calculatePrice(modelAttributes.volume), modelAttributes)

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} accept=".stl,.obj"/>
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {isRejected ? <div>This file is too large.</div> : null}
    </div>
  )
}

export default DropZone