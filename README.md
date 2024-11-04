# Church Plus

Este é um projeto de conclusão de curso do curso de **Bacharel em Engenharia de Software da Unicesumar**. 🚀

O objetivo deste software é auxiliar igrejas na administração tanto dos dados pessoais de sua membresia bem como os dados financeiros, através do cadastro de membros e também de contribuições financeiras

## Rodando o projeto localmente

1. Antes de iniciar o projeto é necessário adicionar na raiz do projeto um arquivo com o nome .env contendo as seguintes configurações:

   ```
   POSTGRES_PASSWORD=local_password
   POSTGRES_USER=local_user
   POSTGRES_PORT=5432
   POSTGRES_HOST=localhost
   POSTGRES_DB=local_db
   DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NODE_ENV=development
   NEXTAUTH_URL=http://localhost:3000
   HOST_URL=http://localhost:3000
   NEXTAUTH_SECRET=secret
   GOOGLE_CLIENT_SECRET=(necessário criar em https://console.cloud.google.com)
   GOOGLE_CLIENT_ID=(necessário criar em https://console.cloud.google.com)
   ```

2. Execute o comando **npm ci** para instalar as dependências do projeto

3. Inicie o servidor de desenvolvimento com os seguintes comandos:

```bash
npm run dev
# OU
yarn dev
# OU
pnpm dev
# OU
bun dev
```

4. Abra o endereço [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

5. Realize o login no sistema utilizando uma conta gmail de sua preferência(isso criará um usuário automaticamente para você no sistema).

### obs: Caso deseje acessar a versão de produção, acesse: [Church Plus](https://church-plus.vercel.app)

## Tecnologias utilizadas no projeto

- TypeScript
- Next.js
- React JS
- NPM
- Docker
- Git
- PostgreSQL ou MongoDB
- Jest
- Vercel
- Neon
- TailwindCSS
