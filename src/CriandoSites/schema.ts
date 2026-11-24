import { z } from "zod";

export const criandoSitesSchema = z.object({
  dia: z.number(),
  categoria: z.string(),
  nomeEmpresa: z.string(),
  cidade: z.string(),
  nota: z.string(),
  avaliacoes: z.number(),
  dominio: z.string(),
  palavraChave: z.string(),
  opcoesRoleta: z.array(z.string()),
  /** Arquivos em public/ (opcional). Sem eles, entram cards com emoji. */
  videoAbertura: z.string().optional(),
  midias: z.object({
    categoria: z.string().optional(),
    vouAtras: z.string().optional(),
    fachada: z.string().optional(),
    fichaGoogle: z.string().optional(),
    pesquisa: z.string().optional(),
    resultado: z.string().optional(),
    final: z.string().optional(),
    printsSite: z.array(z.string()).optional(),
  }),
});

export type CriandoSitesProps = z.infer<typeof criandoSitesSchema>;

export const padraoDia2: CriandoSitesProps = {
  dia: 2,
  categoria: "Barbearia",
  nomeEmpresa: "Navalha",
  cidade: "Sua cidade",
  nota: "4,8",
  avaliacoes: 64,
  dominio: "barbearianavalha.com.br",
  palavraChave: "site",
  opcoesRoleta: [
    "Padaria",
    "Academia",
    "Barbearia",
    "Pet shop",
    "Dentista",
    "Pizzaria",
    "Oficina",
    "Floricultura",
    "Mercado",
    "Salão",
  ],
  midias: {},
};
