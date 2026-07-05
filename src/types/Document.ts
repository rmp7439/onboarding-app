export interface ScanResult {
  uri: string;
  width: number;
  height: number;
  filename: string;
}

export interface PreviewState extends ScanResult {
  side: 'front' | 'back';
  source: 'gallery' | 'camera';
}

export interface DocumentItem {
  id: string;
  title: string;
  uri: string | null;
  filename: string | null;
}