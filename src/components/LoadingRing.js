import React from 'react'

import './loading-ring.css'

const LoadingRing = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default LoadingRing