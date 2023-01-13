
import {useRef, useEffect, useLayoutEffect, useState} from 'react'
import { SketchPicker } from 'react-color'

const Whiteboard = ({visible, setVisible}) => {
  let contextRef = useRef()
  let lastPoint = useRef()
  let currentForce = useRef(1)
  let colorRef = useRef()
  let canvasRef = useRef()
  const [showPickerColor, setShowPickerColor] = useState(false)
  const [color, setColor] = useState('#000000')
  const randomColor = () => {
    // let r = Math.random() * 255;
    // let g = Math.random() * 255;
    // let b = Math.random() * 255;
    return color;
  }
  
  const draw = (data) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(data.lastPoint.x, data.lastPoint.y);
    contextRef.current.lineTo(data.x, data.y);
    contextRef.current.strokeStyle = data.color;
    contextRef.current.lineWidth = Math.pow(data.force || 1, 4) * 2;
    contextRef.current.lineCap = 'round';
    contextRef.current.stroke();
  }

  const force = (e) => {
    currentForce.current = e.webkitForce || 1;
  }

  const move = (e) => {
    const x = e.clientX - 30 * window.innerWidth / 200
    const y = e.clientY - 35 * window.innerHeight / 200
    // const x = e.clientX
    // const y = e.clientY
    
    if (e.buttons) {
      if (x < 0 || y < 0) {
        lastPoint.current = undefined
        return
      }
      if (!lastPoint.current) {
        lastPoint.current = { x: x, y: y };
        return;
      }
      console.log( { x: x, y: y })
      draw({
          lastPoint: lastPoint.current,
          x: x,
          y: y,
          force: force,
          color: colorRef.current || 'green'
      });
      lastPoint.current = { x: x, y: y };
    } else {
      lastPoint.current = {}
    }
  }
  // const move = (e) => {
  //   if (e.buttons) {
  //     if (e.offsetX < 0 || e.offsetY < 0) {
  //       lastPoint.current = undefined
  //       return
  //     }
  //     if (!lastPoint.current) {
  //       lastPoint.current = { x: e.offsetX, y: e.offsetY };
  //       return;
  //     }
  //     console.log( { x: e.offsetX, y: e.offsetY })
  //     draw({
  //         lastPoint: lastPoint.current,
  //         x: e.offsetX,
  //         y: e.offsetY,
  //         force: force,
  //         color: colorRef.current || 'green'
  //     });
  //     lastPoint.current = { x: e.offsetX, y: e.offsetY };
  //   } else {
  //     lastPoint.current = {}
  //   }
  // }

  useLayoutEffect(() => {
    if (canvasRef.current === null || canvasRef.current === undefined)
      return

    const changeSizeWindow = () => {
      if (canvasRef.current === null || canvasRef.current === undefined)
        return
      canvasRef.current.width = 70 * window.innerWidth / 100
      canvasRef.current.height = 65 * window.innerHeight / 100
      contextRef.current =  canvasRef.current.getContext('2d')
      contextRef.current.clearRect(0, 0,  canvasRef.current.width,  canvasRef.current.height);
    }

    canvasRef.current.width = 70 * window.innerWidth / 100
    canvasRef.current.height = 65 * window.innerHeight / 100
    contextRef.current =  canvasRef.current.getContext('2d')
    contextRef.current.clearRect(0, 0,  canvasRef.current.width,  canvasRef.current.height);
    colorRef.current = randomColor()
    // window.onmousemove = move

    window.onresize = changeSizeWindow
  })

  return (
    <>
    {
      visible && (
        <div style={{
          position: 'fixed',
          zIndex: '999',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div
            className="rounded"
            style={{
              backgroundColor: 'white',
              width: '70%',
              height: '70%'
            }}
          >
            <div 
              style={{
                width: '100%',
                backgroundColor: '#e5e7eb'
              }}
              className='rounded flex justify-between p-1'
            >
              <div className='flex'>
                <span 
                  className="material-icons text-black mr-1 cursor-pointer"
                  onClick={() => setShowPickerColor(!showPickerColor)}
                >app_registration</span>
                <span 
                  className="material-icons text-black pr-1 cursor-pointer"
                  onClick={() => setVisible()}
                >delete_sweep</span>
              </div>
              <div>
                <span 
                  className="material-icons text-red-500 pr-1 cursor-pointer"
                  onClick={() => setVisible()}
                >close</span>
              </div>
            </div>
            {
              showPickerColor && (
                <div
                  style={{
                    zIndex: '999',
                  }}
                >
                  <SketchPicker 
                    color={ color }
                    onChangeComplete={ (color) => setColor(color.hex) }
                  />
                </div>
              )
            }
            <canvas 
              ref={canvasRef}
              onMouseMove={e => {
                // console.log({ x: e.clientX, y: e.clientY })
                move(e)
              }}
            ></canvas>
          </div>
        </div>
      )
    }
    </>
  )
}

export default Whiteboard