export { };

declare module '*.glb';
declare module '*.png';

declare module 'meshline' {
  export class MeshLineGeometry {
    constructor();
    setPoints(points: any[]): void;
  }
  export class MeshLineMaterial {
    constructor(parameters?: any);
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: {
        color?: string;
        depthTest?: boolean;
        resolution?: [number, number];
        useMap?: boolean;
        map?: any;
        repeat?: [number, number];
        lineWidth?: number;
      };
    }
  }
}

- src/vite-env.d.ts
/// <reference types="vite/client" />
declare module '*.glb';
declare module '*.png';
