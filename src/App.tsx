/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree, MouseEvent } from 'react-three-fiber'
import THREE, { MeshBasicMaterial, Camera } from 'three'
import { useProgress, Html, useGLTFLoader, useSimplification, meshBounds, Stats } from "drei";

function Box(props : any) {
  // This reference will give us direct access to the mesh
  const mesh : any = useRef()
  const {viewport} = useThree()

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame((state) => {
    mesh.current.rotation.y -= .001
    // mesh.current.rotation.x = Math.tan(state.clock.elapsedTime)
  })

  let { scene: model } = useGLTFLoader(
    '/models/Suzanne.gltf',
    true // use draco binaries in /draco-gltf/
  )
  model.traverse( o  => {
    let mesh : THREE.Mesh = o as THREE.Mesh
    if (mesh.isMesh){
      mesh.material = new MeshBasicMaterial({
        wireframe: true,
        wireframeLinewidth: .1,
        opacity: .100,
        color: 0xffffff,
      })
    }
  })

  // let scaleFactor = 1/viewport.width*2
  let scaleFactor = 20

  model.scale.set(.05*scaleFactor, .05*scaleFactor,.05*scaleFactor)

  return (
    <mesh
      {...props}
      ref={mesh}
      >
      <primitive object={model}/>
    </mesh>
  )
}

function Loader() {
  const { progress } = useProgress()
  return <Html center><h1>{progress} % loaded</h1></Html>
}

function Main({mouseX, mouseY}: any) {

  const {viewport, size} = useThree()
  
  let mx = (mouseX - size.width/2)/viewport.factor/1.5
  let my = (size.height/2 - mouseY)/viewport.factor/1.5
  
  
  return (
<Suspense fallback={<Loader/>}>

    <Html center>
  <h1>monke sliding into ur dms</h1>
  <img src="https://media.giphy.com/media/KPgOYtIRnFOOk/giphy.gif" alt="" className=""/>
    </Html>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Box position={[mx, my, 0]} />
    </Suspense>
  )
}

function App() {

  const [mousePos, setMousePos] = useState([0,0])

  const updateMousePos = (e: any) => {
    let tEvent = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent
    setMousePos([e.pageX || tEvent.pageX, e.pageY || tEvent.pageY])
  }

  return (
  <Canvas colorManagement onMouseMove={updateMousePos} onTouchMove={updateMousePos}
  camera={{fov: 30}}>
   <Stats/>
   <Main mouseX={mousePos[0]} mouseY={mousePos[1]}/>
  </Canvas>
  );
}

export default App;
