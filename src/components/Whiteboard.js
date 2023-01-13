
import {useRef, useEffect, useLayoutEffect, useState} from 'react'


const Whiteboard = ({visible, setVisible}) => {
  let contextRef = useRef()
  let lastPoint = useRef()
  let currentForce = useRef(1)
  let colorRef = useRef()
  let canvasRef = useRef()
  const [canvasState, setCanvasState] = useState()

  useLayoutEffect(() => {
    const randomColor = () => {
      let r = Math.random() * 255;
      let g = Math.random() * 255;
      let b = Math.random() * 255;
      return `rgb(${r}, ${g}, ${b})`;
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
      if (e.buttons) {
        if (!lastPoint.current) {
          lastPoint.current = { x: e.offsetX, y: e.offsetY };
          return;
        }
        console.log( { x: e.offsetX, y: e.offsetY })
        draw({
            lastPoint: lastPoint.current,
            x: e.offsetX,
            y: e.offsetY,
            force: force,
            color: colorRef.current || 'green'
        });
        lastPoint.current = { x: e.offsetX, y: e.offsetY };
      } else {
        lastPoint.current = {}
      }
    }  
    // console.log("canvas", canvasState)
    if (canvasRef.current === undefined) 
      return

    const changeSizeWindow = () => {
      canvasRef.current.width = 70 * window.innerWidth / 100
      canvasRef.current.height = 70 * window.innerHeight / 100
      contextRef.current =  canvasRef.current.getContext('2d')
      contextRef.current.clearRect(0, 0,  canvasRef.current.width,  canvasRef.current.height);
    }

    canvasRef.current.width = 70 * window.innerWidth / 100
    canvasRef.current.height = 70 * window.innerHeight / 100
    contextRef.current =  canvasRef.current.getContext('2d')
    contextRef.current.clearRect(0, 0,  canvasRef.current.width,  canvasRef.current.height);
    colorRef.current = randomColor()
    window.onmousemove = move

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
            <div style={{
              width: '100%',
              textAlign: 'right'
            }}>
              <span 
                className="material-icons text-red-500 pr-1 cursor-pointer"
                onClick={() => setVisible()}
              >close</span>
            </div>
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      )
    }
    </>
  )
}

export default Whiteboard