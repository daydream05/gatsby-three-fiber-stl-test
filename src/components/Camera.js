import React from 'react'
import { useThree } from 'react-three-fiber'

const Camera = () => {
  const { viewport } = useThree()
  
  console.log(viewport)

  return (
    <orthographicCamera
      args={[
        viewport.width / -2,
        viewport.width / 2,
        viewport.height / 2,
        viewport.height / -2,
        0.1,
        2000,
      ]}
    />
  )
}

export default Camera