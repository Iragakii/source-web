export { };

declare module '*.glb';
declare module '*.png';

declare module 'meshline' {
  import { BufferGeometry, Material, Texture } from 'three';
  
  export class MeshLineGeometry extends BufferGeometry {
    constructor();
    setPoints(points: any[]): void;
  }
  
  export class MeshLineMaterial extends Material {
    constructor(parameters?: {
      color?: string | number;
      depthTest?: boolean;
      resolution?: [number, number];
      useMap?: boolean;
      map?: Texture;
      repeat?: [number, number];
      lineWidth?: number;
      [key: string]: any;
    });
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: {
        attach?: string;
        ref?: React.Ref<any>;
        [key: string]: any;
      };
      meshLineMaterial: {
        attach?: string;
        color?: string | number;
        depthTest?: boolean;
        resolution?: [number, number];
        useMap?: boolean;
        map?: any;
        repeat?: [number, number];
        lineWidth?: number;
        ref?: React.Ref<any>;
        [key: string]: any;
      };
    }
  }
}
