# Sistema de Monitoramento de Acessos - Docker + Redis

Trabalho prático desenvolvido para a disciplina de Sistemas Operacionais sob a orientação do Professor Matheus Barquette.

## Tecnologias Utilizadas
- **Node.js (Express)** para a camada de aplicação.
- **Redis (Alpine)** como banco de dados NoSQL em memória.
- **Docker & Docker Compose** para orquestração e containerização.

## ## Uso de IA
Este projeto foi desenvolvido com suporte assistido da inteligência artificial Gemini.
- **O que foi gerado/assistido:** A IA auxiliou na refatoração da rota do `server.js` utilizando o módulo `fs` para ler o arquivo HTML isolado na pasta `public/` e injetar a tag dinâmica `{{visitas}}`. Também forneceu a base técnica detalhada para preenchimento dos comentários de cache do Dockerfile.
- **O que mudei/aprendi:** Compreendi como o Docker isola os ambientes de rede em pontes (bridge) e a importância de escutar no IP universal `0.0.0.0` para expor o servidor Express de dentro do container para a máquina hospedeira.