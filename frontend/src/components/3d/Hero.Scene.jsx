import React from 'react';
import { Engine, Scene } from 'react-babylonjs';
import { Vector3, Color3 } from '@babylonjs/core';

export default function HeroScene() {
  return (
    <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-blue-50">
      <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
        <Scene clearColor={new Color3(0.85, 0.92, 1.0)}> 
          <arcRotateCamera
            name="camera1"
            target={Vector3.Zero()}
            alpha={Math.PI / 4}
            beta={Math.PI / 3}
            radius={6}
            wheelPrecision={50}
          />
          <hemisphericLight
            name="light1"
            intensity={0.8}
            direction={new Vector3(0, 1, 0)}
          />
          <sphere
            name="pelampung"
            diameter={2}
            segments={32}
            position={new Vector3(0, 0, 0)}
          >
            <standardMaterial
              name="material-merah"
              diffuseColor={new Color3(0.9, 0.2, 0.2)}
              specularColor={new Color3(0.5, 0.5, 0.5)}
            />
          </sphere>
        </Scene>
      </Engine>
    </div>
  );
}