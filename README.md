# Sistema de Monitoramento de Acessos — Docker & Redis

Trabalho prático desenvolvido para a disciplina de **Sistemas Operacionais** sob a orientação do **Professor Matheus Barquette**.

O objetivo deste projeto é demonstrar de forma prática os conceitos de conteinerização, isolamento de processos, gerência de concorrência, comunicação em rede interna assíncrona e persistência de dados utilizando Docker e Docker Compose.

---

## Tecnologias Utilizadas

* **Node.js (Express):** Camada de aplicação assíncrona, responsável por receber as requisições HTTP e renderizar a interface.
* **Redis (Alpine):** Banco de dados NoSQL em memória de alto desempenho, utilizado para gerenciar o estado e o contador atômico de acessos.
* **Docker & Docker Compose:** Ferramentas de orquestração e isolamento de infraestrutura.

---

## Uso de IA (Declaração de Integridade Acadêmica)

Em conformidade com as regras estabelecidas para a entrega, declara-se o uso assistido de Inteligência Artificial (Gemini) no desenvolvimento do projeto:

* **O que foi gerado/assistido:** A IA forneceu suporte na fundamentação teórica dos comentários técnicos do `Dockerfile` e do código-fonte.
* **O que foi modificado/aprendido:** Compreendi como o ecossistema do Docker isola as redes em modo *bridge*, forçando a aplicação a escutar no endereço global `0.0.0.0` para receber tráfego vindo do host externo. Assimilei também a relevância da atomicidade do comando `INCR` do Redis para evitar condições de corrida (*Race Conditions*) em sistemas operacionais concorrentes.

---

## Estrutura do Projeto

A árvore de diretórios segue estritamente a organização exigida pelo roteiro:

```text
tasklist/
├── docker-compose.yml
├── README.md
├── src/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── public/
│       └── index.html
└── evidencias/
    ├── 1. Inicialização do Ambiente e Orquestração de Serviços.png
    ├── 2. Orquestração e Inicialização Simultânea dos Serviços (Logs Integrados).png
    ├── 3. Monitoramento dos Containers Ativos via terminal.png
    ├── 4. Monitoramento dos Containers Ativos via Docker Desktop.png
    ├── 5. Validação em Runtime da Aplicação no Navegador Hospedeiro.png
    ├── 6. Estrutura do Projeto.png
    └── diario.md
```

---

# Evidências de Execução

Abaixo estão as capturas de tela que validam o funcionamento do projeto com suas respectivas legendas explicativas.

## 1. Inicialização do Ambiente e Orquestração de Serviços

![Inicialização do Ambiente](evidencias/1.%20Inicialização%20do%20Ambiente%20e%20Orquestração%20de%20Serviços.png)

**Legenda:**
Execução do comando `docker compose up --build`. O Docker Compose lê o arquivo `docker-compose.yml`, cria a rede virtual isolada e inicia a construção da imagem customizada do Node.js.

---

## 2. Orquestração e Inicialização Simultânea dos Serviços (Logs Integrados)

![Logs Integrados](evidencias/2.%20Orquestração%20e%20Inicialização%20Simultânea%20dos%20Serviços%20\(Logs%20Integrados\).png)

**Legenda:**
Logs integrados mostrando o banco Redis pronto na porta `6379` e, logo em seguida, a aplicação Node.js iniciando com sucesso e estabelecendo a conexão com o banco de dados.

---

## 3. Monitoramento dos Containers Ativos via Terminal

![Containers via Terminal](evidencias/3.%20Monitoramento%20dos%20Containers%20Ativos%20via%20terminal.png)

**Legenda:**
Confirmação no terminal de que os dois containers (`redis-db-1` e `app-1`) foram criados e estão rodando em background de forma saudável na rede interna do Docker.

---

## 4. Monitoramento dos Containers Ativos via Docker Desktop

![Containers via Docker Desktop](evidencias/4.%20Monitoramento%20dos%20Containers%20Ativos%20via%20Docker%20Desktop.png)

**Legenda:**
Visualização no Docker Desktop confirmando o isolamento de processos e o status ativo (*running*) de ambos os containers, demonstrando o baixo consumo de CPU e memória do sistema.

---

## 5. Validação em Runtime da Aplicação no Navegador Hospedeiro

![Aplicação em Execução](evidencias/5.%20Validação%20em%20Runtime%20da%20Aplicação%20no%20Navegador%20Hospedeiro.png)

**Legenda:**
Aplicação funcionando em `http://localhost:3000`. O servidor Express processa a requisição, incrementa o contador de forma atômica no Redis e devolve o HTML atualizado com a quantidade de acessos registrada.

---

## 6. Estrutura de Pastas Homologada

![Estrutura de Pastas](evidencias/6.%20Estrutura%20do%20Projeto.png)

**Legenda:**
Estrutura final de arquivos organizada exatamente de acordo com as exigências do trabalho: `Dockerfile` dentro de `src/`, `docker-compose.yml` na raiz e os prints armazenados na pasta `evidencias/`.

---

## Resumo das Evidências

| Evidência | Descrição                                        |
| --------- | ------------------------------------------------ |
| 01        | Inicialização do ambiente e build dos containers |
| 02        | Logs integrados dos serviços                     |
| 03        | Containers ativos via terminal                   |
| 04        | Containers ativos via Docker Desktop             |
| 05        | Aplicação executando no navegador                |
| 06        | Estrutura de pastas do projeto                   |

---

## Execução do Projeto

### Construir e iniciar os containers

```bash
docker compose up --build
```

### Executar em background

```bash
docker compose up -d
```

### Verificar containers em execução

```bash
docker ps
```

### Encerrar os serviços

```bash
docker compose down
```

---

## Resultado Esperado

Após a inicialização dos containers, a aplicação estará disponível em:

```text
http://localhost:3000
```

Cada acesso à página incrementa automaticamente um contador armazenado no Redis, demonstrando a comunicação entre containers, persistência de estado e execução concorrente de serviços em um ambiente conteinerizado.
