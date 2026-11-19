import { createContext, useContext } from 'react';

export type FotoViagem = {
  id: string;
  local: string;
  descricao: string;
  data: string;
  imagemUri: string;
  latitude?: number;
  longitude?: number;
};

export type Pais = {
  id: string;
  nome: string;
  cor: string;
  emoji: string;
  fotos: FotoViagem[];
};

export type ViagemContextValue = {
  paises: Pais[];
  adicionarViagem: (paisId: string, foto: FotoViagem) => void;
};

export const ViagemContext = createContext<ViagemContextValue | null>(null);

export function useViagens() {
  const context = useContext(ViagemContext);
  if (!context) throw new Error('useViagens deve ser usado dentro de ViagemProvider');
  return context;
}

export type ThemeContextValue = {
  isDarkMode: boolean;
  toggleTheme: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
}

export type RootStackParamList = {
  Login: undefined;
  MainTabs: { usuario: string };
  OngDetalhes: { paisId: string; nomePais: string };
};

export type TabParamList = {
  Explorar: { usuario: string };
  Cadastro: { usuario: string };
  Perfil: { usuario: string };
};

