import React from 'react'
import { useThree } from 'react-three-fiber'

const Camera = () => {
  const { size } = useThree()

  return (
    <orthographicCamera
      args={[
        (size.width) / -2,
        (size.width) / 2,
        size.height / 2,
        size.height / -2,
        150,
        1000,
      ]}
    />
  )
}

export default Camera