export interface Node {
  id: string;
  url: string;
  title?: string;
  children?: Node[];
}
