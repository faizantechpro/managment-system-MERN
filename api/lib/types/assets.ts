export type Transformation = {
  key?: string;
  width?: number; // width
  height?: number; // height
  fit?: 'cover' | 'contain' | 'inside' | 'outside'; // fit
  withoutEnlargement?: boolean; // Without Enlargement
  quality?: number;
};
