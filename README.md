# AppOrcamento

App de precificação baseado na planilha `Arquivos/Planilha_Precificacao_MenuSuspenso.ods`.

## Funcionalidades

- **Precificação** (tela principal): nome do produto + itens (material ou serviço do cadastro), quantidade e margem de lucro (padrão 100%).
  - Custo total = quantidade × custo unitário; Preço final = custo total × (1 + margem/100).
- **Resumo**: custo total, preço de venda e lucro; botão **Aprovar** salva uma cópia estática (nomes e custos congelados) e limpa a precificação.
- **Modelos**: projetos pré-cadastrados para reuso. Na Precificação, **Salvar como modelo** guarda os itens atuais (nome do produto = nome do modelo); na aba Modelos, **Usar** preenche a precificação com todos os itens, que podem ser ajustados. Modelos usam os custos atuais do cadastro.
- **Cadastros**: adicionar, editar e excluir materiais e serviços. Itens em uso na precificação atual ou em algum modelo não podem ser excluídos.
- **Aprovadas**: lista e detalhe das precificações aprovadas.

> Os dados ficam apenas em memória e são perdidos quando o app é fechado.

## Estrutura

- `App.tsx` — navegação (abas Precificação/Cadastros/Aprovadas + stack com Resumo e Detalhe)
- `src/store/AppStore.tsx` — estado global em memória (Context) e ações
- `src/utils/pricing.ts` — fórmulas da planilha; `src/utils/format.ts` — formatação BR
- `src/data/initialData.ts` — materiais e serviços iniciais (da planilha)
- `src/screens/` — telas; `src/components/` — UI compartilhada, seletor de itens e quadro de resumo
- `__tests__/pricing.test.ts` — testes da lógica de cálculo

## Rodando no Android (Windows) — observações deste ambiente

1. **Caminho com "ç"**: o build Gradle falha com caracteres não-ASCII no caminho (`App orçamento`).
   Mapeie a pasta para uma unidade ASCII antes de compilar (o `subst` não persiste após reiniciar):

   ```powershell
   subst R: "C:\_code\Estudos\Pessoal\App orçamento"
   ```

2. **Metro** deve rodar a partir do caminho original (não da unidade `R:`):

   ```powershell
   cd "C:\_code\Estudos\Pessoal\App orçamento\AppOrcamento"
   npm start
   ```

3. **Build/instalação** a partir da unidade `R:` (com o emulador aberto):

   ```powershell
   cd R:\AppOrcamento
   npx react-native run-android --no-packager
   ```

4. **Proxy Zscaler**: foi adicionado `systemProp.javax.net.ssl.trustStoreType=Windows-ROOT` em
   `%USERPROFILE%\.gradle\gradle.properties` para o Gradle confiar nos certificados do Windows.

---
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app â€” you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes â€”Â this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd âŒ˜</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
