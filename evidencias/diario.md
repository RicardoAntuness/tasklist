# Diário de Desenvolvimento — Registro de Erros e Soluções

Este documento registra os problemas reais enfrentados durante a arquitetura e implantação do ecossistema Docker para o Sistema de Monitoramento de Acessos, detalhando o diagnóstico e a solução adotada sob a perspectiva de Sistemas Operacionais.

---

### Erro Principal: Falha de Inicialização do Container da Aplicação (Conflito na Porta 3000)

* **Mensagem de Erro / Sintoma:** Ao executar `docker compose up`, o container do Redis subia normalmente, mas o container da aplicação Node.js falhava ao tentar expor a porta ou exibia uma página em branco/incorreta que pertencia ao **pgAdmin** local. No terminal, era exibida uma mensagem de endereço já em uso (`listen EADDRINUSE: address already in use :::3000`).
* **Diagnóstico Teórico:** Ocorreu um conflito de alocação de recursos de rede no Sistema Operacional hospedeiro. Uma instância local do gerenciador de banco de dados pgAdmin já estava em execução em background no host e travando a porta **3000**. Como dois processos não podem escutar simultaneamente na mesma porta IP do host, o Docker não conseguia fazer o mapeamento (`ports: "3000:3000"`) para direcionar o tráfego externo ao container da aplicação.
* **Solução Adotada:** Foi realizada a identificação do processo nativo através do monitor de recursos/terminal e o serviço do pgAdmin local foi encerrado, liberando a porta 3000.

---


### Segundo Erro: Container Encerrando Imediatamente após o Build (`Exited (0)`)

* **Mensagem de Erro / Sintoma:** O processo de build do Docker finalizava com sucesso, mas logo após o comando `docker compose up`, o container da aplicação Node.js entrava instantaneamente em estado de parada (`Exited (0)`), sem manter o servidor ativo.
* **Diagnóstico Teórico:** Um container Docker permanece em execução enquanto o seu processo principal (PID 1) estiver ativo. No arquivo `package.json` original, o script de inicialização (`start`) não estava configurado ou a instrução de execução final no `Dockerfile` não encontrava o arquivo correto por problemas de diretório padrão (`WORKDIR`).
* **Solução Adotada:** Ajustou-se a instrução final do `Dockerfile` para usar a sintaxe de array explícita `CMD ["node", "server.js"]` e garantiu-se que o `WORKDIR /app` estivesse devidamente sincronizado com a cópia dos arquivos de manifesto, mantendo o processo do servidor Express escutando as requisições por tempo indeterminado.