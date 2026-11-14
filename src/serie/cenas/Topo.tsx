import { Cinetico } from "../ui/Cinetico";

/** Frase curta no alto da cena, palavra a palavra. */
export const Topo: React.FC<{ texto: string; em?: number; tamanho?: number; tom?: "azul" | "vermelho"; top?: number }> = ({ texto, em = 0, tamanho = 70, tom, top = 280 }) => (
  <div style={{ position: "absolute", top, left: 70, right: 70 }}>
    <Cinetico texto={texto} inicio={em} intervalo={2} tamanho={tamanho} alinhar="center" tom={tom} />
  </div>
);
