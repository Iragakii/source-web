import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: React.DetailedHTMLProps<React.HTMLAttributes<MeshLineGeometry>, MeshLineGeometry> & {
        attach?: string;
        ref?: React.Ref<MeshLineGeometry>;
      };
      meshLineMaterial: React.DetailedHTMLProps<React.HTMLAttributes<MeshLineMaterial>, MeshLineMaterial> & {
        attach?: string;
        color?: string | number;
        depthTest?: boolean;
        resolution?: [number, number];
        useMap?: boolean;
        map?: any;
        repeat?: [number, number];
        lineWidth?: number;
        ref?: React.Ref<MeshLineMaterial>;
      };
    }
  }
}

export {};
