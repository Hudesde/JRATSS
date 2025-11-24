export interface BigFiveQuestion {
  text: string;
  trait: 'neuroticismo' | 'extraversión' | 'apertura' | 'amabilidad' | 'responsabilidad';
  section: number;
}

export interface BigFiveResult {
  id_usuario: number;
  neuroticismo: number;
  extraversion: number; // <-- sin tilde, igual que backend
  apertura: number;
  amabilidad: number;
  responsabilidad: number;
}

export interface BigFiveTestEntry {
  userId: string;
  result: BigFiveResult;
  date: string;
}
