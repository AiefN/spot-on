import React, { useEffect, useRef } from 'react';
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core';

export default function FishingScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);

    const createScene = () => {
      const scene = new Scene(engine);
      scene.clearColor = new Vector3(0.9, 0.95, 1.0); 

      const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvas, true);

      const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene);
      sphere.position.y = 1;

      const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);

      return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(() => {
      scene.render();
    });

    const resize = () => {
      engine.resize();
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      engine.dispose();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full outline-none touch-none rounded-lg shadow-lg"
      style={{ minHeight: '400px' }}
    />
  );
}