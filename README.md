# Diário de Viagem
Aplicativo mobile para registrar, organizar e revisitar experiências de viagem.

## Título e identificação
- **Nome do aplicativo:** Diário de Viagem
- **Integrantes da equipe:** Alanis Venerruche de Carvalho, Ana Júlia Menezes da Silva, Isabela Dessia Viana
- **Turma SENAI:** DEV-OC-2
## Problema e solução
### Problema
Durante uma viagem, fotos, locais visitados, anotações e lembranças costumam ficar espalhados em diferentes aplicativos. Isso dificulta organizar a experiência e reencontrar informações importantes depois do passeio.
### Público-alvo
O aplicativo é destinado a viajantes, turistas e pessoas que desejam manter um registro pessoal das suas viagens de forma simples e organizada.
### Solução
O Diário de Viagem centraliza os registros da viagem em um único aplicativo. A proposta é permitir que o usuário salve anotações, imagens, locais visitados e outros momentos importantes, formando um diário digital fácil de consultar.
## Seção visual
As imagens abaixo devem ser adicionadas à pasta `docs/` do projeto. Os arquivos podem ser substituídos pelos screenshots finais do protótipo e do aplicativo em funcionamento.
### Wireframes e protótipo
![Wireframe da tela inicial](./docs/wireframe-inicial.png)
![Wireframe do registro de viagem](./docs/wireframe-registro.png)
### Telas do aplicativo
![Tela inicial em modo claro](./docs/tela-light-mode.png)
![Tela de registro de viagem](./docs/tela-registro.png)
![Tela de detalhes da viagem](./docs/tela-detalhes.png)
## Modelagem de dados e arquitetura
### Arquitetura
O projeto utiliza React Native com Expo e Expo Router para navegação baseada em arquivos. As telas ficam em `src/app/`, enquanto configurações globais de navegação ficam no arquivo `src/app/_layout.tsx`.
O aplicativo está preparado para utilizar recursos do dispositivo, como seleção de imagens, localização, notificações e armazenamento local. As principais tecnologias e bibliotecas são:
- **React Native:** construção da interface mobile;
- **Expo SDK 57:** execução e integração com recursos nativos;
- **Expo Router:** navegação baseada em arquivos;
- **Expo SQLite:** persistência local estruturada;
- **AsyncStorage:** armazenamento local de preferências e dados simples;
- **Expo Image Picker:** seleção de imagens do dispositivo;
- **Expo Location:** acesso à localização, quando autorizado pelo usuário;
- **TypeScript:** tipagem e manutenção do código.
### Entidades principais
| Entidade | Campos principais | Descrição |
| --- | --- | --- |
| Viagem | `id`, `titulo`, `destino`, `dataInicio`, `dataFim`, `descricao` | Agrupa os registros de uma viagem. |
| Registro | `id`, `viagemId`, `titulo`, `texto`, `data`, `latitude`, `longitude` | Representa uma lembrança ou anotação da viagem. |
| Imagem | `id`, `registroId`, `uri`, `legenda` | Armazena a referência de uma imagem associada a um registro. |
O campo `viagemId` relaciona cada registro à sua viagem, e `registroId` relaciona cada imagem ao registro correspondente.

### Esquema SQLite

Uma implementação possível para a tabela principal é:

```sql
CREATE TABLE viagens (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   titulo TEXT NOT NULL,
   destino TEXT NOT NULL,
   data_inicio TEXT,
   data_fim TEXT,
   descricao TEXT
);
```

Os registros e as imagens podem utilizar `viagem_id` e `registro_id` como chaves de relacionamento, mantendo cada lembrança associada à viagem correta.

### Preferências no AsyncStorage

As preferências simples do usuário podem ser salvas com as seguintes chaves:

| Chave | Tipo | Finalidade |
| --- | --- | --- |
| `@diario_viagem:tema` | `string` | Armazena o tema visual escolhido. |
| `@diario_viagem:ultima_viagem` | `string` | Guarda o identificador da última viagem acessada. |
| `@diario_viagem:permissoes_localizacao` | `boolean` | Registra a preferência de uso da localização. |

### Regra do acelerômetro

Quando o sensor de acelerômetro for usado para identificar movimento, a intensidade pode ser calculada pela magnitude do vetor:

$$
A = \sqrt{x^2 + y^2 + z^2}
$$

Se a magnitude `A` ultrapassar o limite definido pela aplicação, o evento pode ser tratado como movimento significativo e usado para sugerir um novo registro.
## Manual de instalação e execução
### Pré-requisitos
- Node.js instalado;
- npm instalado;
- Expo Go instalado no celular, ou um emulador configurado;
- dispositivo e computador conectados à internet.
### Instalação
1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd DiarioDeViagem
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
### Execução
Inicie o servidor Expo usando o túnel:
```bash
npx expo start --tunnel
```
Depois, leia o QR Code com o Expo Go ou escolha um emulador disponível no terminal do Expo.
### Comandos úteis
```bash
npx expo start
npx expo start --android
npx expo start --ios
npx expo start --web
npx expo lint
```
## Estrutura do projeto
```text
DiarioDeViagem/
├── assets/       # Ícones e imagens do aplicativo
├── docs/         # Wireframes e screenshots da documentação
├── src/app/      # Rotas e telas do Expo Router
├── app.json      # Configurações do Expo
├── package.json  # Dependências e scripts
└── tsconfig.json # Configuração do TypeScript
```
## Referências
- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do Expo Router](https://docs.expo.dev/router/introduction/)
- [Documentação do React Native](https://reactnative.dev/docs/getting-started)
