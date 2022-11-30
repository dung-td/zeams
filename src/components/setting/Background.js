import React from "react"

export const Background = (props) => {
  const { applyEffect } = props
  return (
    <div className="flex bg-white p-4 rounded-md h-full">
      <div className="w-full">
        <p className="font-bold text-md">Background</p>
        <div className="mt-2">
          <canvas className="h-full w-full rounded-md" id="canvasTesting" />
        </div>
        <div className="mt-4 font-medium">
          <p>No effect & blur</p>
          <div className="flex flex-row flex-nowrap justify-center items-center gap-4 px-2 mt-2">
            <div
              className="flex w-4/12 text-center border border-gray-600 p-4 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
              onClick={() => applyEffect("")}
            >
              <span className="material-icons ">block</span>
            </div>

            <div
              className="flex w-4/12 text-center border border-gray-600 p-4 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
              onClick={() => applyEffect("blur")}
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
          <div className="flex flex-row flex-nowrap justify-center items-center gap-4 px-2 mt-2">
            <div
              className="flex w-4/12 text-center border border-gray-600 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
              onClick={() => applyEffect("background")}
            >
              <img
                id="backgroundImage"
                className="rounded-md "
                src={require("../../img/background.jpg")}
              />
            </div>
            <div
              className="flex w-4/12 text-center border border-gray-600 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
              onClick={() => applyEffect("background2")}
            >
              <img
                id="backgroundImage2"
                className="rounded-md "
                src={require("../../img/background2.jpeg")}
              />
            </div>
            <div
              className="flex w-4/12 text-center border border-gray-600 rounded-md justify-center items-center hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer"
              onClick={() => applyEffect("background3")}
            >
              <img
                id="backgroundImage3"
                className="rounded-md "
                src={require("../../img/background3.jpeg")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
