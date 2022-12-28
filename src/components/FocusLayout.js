import React from "react"

function FocusLayout(props) {
  const { mainStreamRef } = props
  const { mainName } = props
  const { peers } = props

  return (
    <div className="w-full h-full flex flex-row justify-center items-center gap-4">
      <div className="relative w-11/12 h-full bg-gray-700 border border-gray-600 rounded-md flex flex-col justify-center items-center object-cover overflow-hidden">
        <div>
          <video ref={mainStreamRef} autoPlay muted />
        </div>
        <p className="absolute z-30 bottom-2 left-2 text-white bg-[#242B2E] px-6 py-2 rounded-md">
          {mainName}
        </p>
      </div>

      <div className="w-1/12 h-full rounded-md flex flex-col justify-center items-center gap-4 text-white">
        {peers.map((index) => {
          if (index > 5) {
            return null
          } else if (index === 5) {
            return (
              <div className="rounded-full bg-gray-700 w-full h-1/5 flex items-center justify-center text-2xl">
                +5
              </div>
            )
          } else
            return (
              <div className="rounded-full bg-gray-700 w-full h-1/5 flex items-center justify-center">
                <span className="material-icons text-3xl">perm_identity</span>
              </div>
            )
        })}
      </div>
    </div>
  )
}

export default FocusLayout
