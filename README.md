Instruções para Configuração e Execução

Estas instruções permitem rodar o projeto em qualquer computador do zero.

1. Pré-requisitos

Instale antes de começar:

Node.js (versão LTS): https://nodejs.org

Git: https://git-scm.com

Expo Go (no celular Android/iOS)

2. Clonar o repositório
git clone <URL-do-repositorio>
cd <nome-da-pasta>

3. Instalar dependências
npm install --legacy-peer-deps


E instale dependências do Expo:

npx expo install expo-notifications @react-native-async-storage/async-storage react-native-get-random-values

4. Executar o aplicativo
npx expo start


O Expo abrirá no navegador.

No celular, abra o Expo Go e escaneie o QR Code exibido.

5. Estrutura esperada do projeto
app/
  login.jsx
  register.jsx
  agenda.jsx
  AddEditAppointment.jsx
  _layout.jsx

contexts/
  AuthContext.jsx

components/
  AppointmentItem.jsx

hooks/
  useThemeColor.js

notifications/
  setup.js

6. Observações importantes

O app funciona apenas em ambiente Expo.

Para notificações, o usuário deve conceder permissões na primeira execução.

Dados são salvos localmente com AsyncStorage.

Requer Expo SDK compatível (52 ou superior).
