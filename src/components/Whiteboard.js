
import {useRef, useEffect} from 'react'

const useCanvas = (callback) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    callback([canvas, ctx]);
  }, []);

  return canvasRef;
}

const Whiteboard = ({visible, setVisible}) => {
  // let context = useRef()
  let lastPoint = useRef()
  let currentForce = useRef(1);
  let colorRef = useRef();
  const canvasRef = useCanvas(([canvas, context]) => {
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // const x = canvas.width;
    // const y = canvas.height;
    const randomColor = () => {
      let r = Math.random() * 255;
      let g = Math.random() * 255;
      let b = Math.random() * 255;
      return `rgb(${r}, ${g}, ${b})`;
    }
    
    const draw = (data) => {
      context.beginPath();
      context.moveTo(data.lastPoint.x, data.lastPoint.y);
      context.lineTo(data.x, data.y);
      context.strokeStyle = data.color;
      context.lineWidth = Math.pow(data.force || 1, 4) * 2;
      context.lineCap = 'round';
      context.stroke();
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
  
    canvas.width = 70 * window.innerWidth / 100
    canvas.height = 70 * window.innerHeight / 100
    context =  canvas.getContext('2d')
    context.clearRect(0, 0,  canvas.width,  canvas.height);
    colorRef.current = randomColor()
    window.onmousemove = move
  });
 

  useEffect(() => {
   
  }, [])


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