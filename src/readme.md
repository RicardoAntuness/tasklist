# [SUA JUSTIFICATIVA AQUI: Por que Node 18 Alpine? Pense em estabilidade LTS e no tamanho reduzido da imagem]
FROM node:18-alpine

# [SUA JUSTIFICATIVA AQUI: Por que definir um diretório de trabalho padrão dentro do container?]
WORKDIR /app

# [SUA JUSTIFICATIVA AQUI: Por que copiar apenas os manifestos primeiro? (Lembre-se da estratégia de cache do Docker mencionada no trabalho)]
COPY package*.json ./

# Instala as dependências necessárias para a aplicação rodar
RUN npm install

# [SUA JUSTIFICATIVA AQUI: Por que copiar o restante do código-fonte só agora?]
COPY . .

# [SUA JUSTIFICATIVA AQUI: Qual a finalidade do EXPOSE documentar a porta?]
EXPOSE 3000

# [SUA JUSTIFICATIVA AQUI: Por que usar CMD em vez de ENTRYPOINT neste caso?]
CMD ["npm", "start"]