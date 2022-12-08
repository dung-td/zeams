import React from "react"

export const Background = (props) => {
  const { applyEffect } = props
  const { changeSize } = props

  const apply = (background) => {
    applyEffect("background", background)
  }

  return (
    <div className="flex bg-white p-4 rounded-md">
      <div className="w-full flex flex-col justify-between">
        <div>
          <p className="font-bold text-md">Background</p>
          <div className="mt-2">
            <canvas className="h-full w-full rounded-md" id="canvasTesting" />
          </div>
          <div className="mt-4 font-medium">
            <p>No effect & blur</p>
            <div className="flex flex-row flex-nowrap justify-center items-center gap-4 px-2 mt-2">
              <div
                className="flex w-4/12 text-center border border-gray-600 p-4 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
                onClick={() => applyEffect("", "")}
              >
                <span className="material-icons ">block</span>
              </div>

              <div
                className="flex w-4/12 text-center border border-gray-600 p-4 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
                onClick={() => applyEffect("blur", "")}
              >
                <span className="material-icons ">blur_on</span>
              </div>

              <div className="flex w-4/12 text-center border border-gray-600 p-4 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer">
                <span className="material-icons ">blur_off</span>
              </div>
            </div>
          </div>

          <div className="mt-4 font-medium">
            <p>Background</p>
            <div className="grid grid-cols-3 gap-4 px-2 mt-2">
              <div
                className="text-center border border-gray-600 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
                onClick={() => apply("backgroundImage1")}
              >
                <img
                  id="backgroundImage1"
                  className="rounded-md w-full h-full"
                  src={require("../../img/background.jpg")}
                  alt="background"
                />
              </div>

              <div
                className="text-center border border-gray-600 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
                onClick={() => apply("backgroundImage2")}
              >
                <img
                  id="backgroundImage2"
                  className="rounded-md w-full h-full"
                  src={require("../../img/background2.jpeg")}
                  alt="background"
                />
              </div>

              <div
                className="text-center border border-gray-600 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
                onClick={() => apply("backgroundImage3")}
              >
                <img
                  id="backgroundImage3"
                  className="rounded-md w-full h-full"
                  src={require("../../img/background3.jpeg")}
                  alt="background"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="px-4 py-2 rounded-md border-2 text-center hover:cursor-pointer"
          onClick={() => {
            changeSize()
          }}
        >
          <p>Apply</p>
        </div>
      </div>
    </div>
  )
}
