const express = require('express');
const redis = require('redis');
const fs = require('fs');
const path = require('path');

const app = express();

// DECISÃO DE INFRAESTRUTURA: Uso de variáveis de ambiente.
// Permite que a porta seja injetada dinamicamente pelo orquestrador (Docker Compose), 
// mantendo a imagem portável e configurável sem necessidade de alterar o código-fonte.
const port = process.env.PORT || 3000;

// DECISÃO DE REDES: Resolução de DNS interno do ecossistema Docker.
// Em vez de mapear um IP estático ou 'localhost' (que apontaria para o próprio container da app),
// utiliza-se o hostname 'redis-db' definido no docker-compose.yml. O serviço de DNS interno 
// da rede isolada do Docker resolve esse nome para o IP privado correto do container do Redis.
const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'redis-db'}:6379`
});

client.on('error', (err) => console.error('Erro de conexão no Redis:', err));

async function iniciarServidor() {
    
    // DECISÃO DE SINCROSTISMO: Bloqueio de inicialização orientada a eventos.
    // A abordagem assíncrona com 'await' garante que a conexão com o banco em memória Redis 
    // esteja estabelecida com sucesso antes de permitir que o Express escute requisições HTTP.
    // Isso evita condições de corrida (race conditions) onde um usuário acessa a aplicação antes do banco estar pronto.
    await client.connect();
    console.log(' Conectado com sucesso ao banco em memória Redis!');

    // Rota principal: Gerenciamento de Concorrência e E/S de Arquivos
    app.get('/', async (req, res) => {
        try {
            // CONCEITO DE SO: Operação Atômica.
            // O comando 'INCR' do Redis é executado de forma atômica em uma única thread no servidor de banco.
            // Isso garante a consistência mútua e impede problemas de concorrência (como Lost Updates),
            // mesmo que milhares de requisições HTTP paralelas cheguem ao container simultaneamente.
            const visitas = await client.incr('visitas');
            
            // CONCEITO DE SO: Caminhos Absolutos no Sistema de Arquivos.
            // Uso do 'path.join' combinado com '__dirname' para construir o caminho absoluto do arquivo.
            // Essencial em ambientes containerizados Linux (como o Alpine), pois garante a localização correta 
            // do recurso independentemente do diretório de onde o processo do container foi disparado.
            const htmlPath = path.join(__dirname, 'public', 'index.html');
            
            // CONCEITO DE SO: E/S não-bloqueante (Non-blocking I/O).
            // A leitura do arquivo HTML é delegada de forma assíncrona para o pool de threads do Node.js (libuv),
            // disparando uma chamada de sistema (syscall) de leitura. Isso impede que a thread principal do 
            // event loop fique bloqueada esperando o disco do container responder, otimizando o throughput da app.
            fs.readFile(htmlPath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Erro ao ler o arquivo index.html:', err);
                    return res.status(500).send('Erro interno ao carregar a interface.');
                }
                
                // Processamento de template em memória: Substitui a marcação curinga pelo dado real do banco
                const htmlModificado = data.replace('{{visitas}}', visitas);
                
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.send(htmlModificado);
            });

        } catch (err) {
            console.error('Falha ao processar comando Redis:', err);
            res.status(500).send('Erro interno na comunicação com o banco de dados.');
        }
    });

    // CONCEITO DE REDES: Interface de Loopback vs Interface Global.
    // O IP '0.0.0.0' diz ao sistema operacional do container para escutar em TODAS as suas interfaces de rede.
    // Se fosse configurado como '127.0.0.1' (localhost), o servidor Express só aceitaria conexões vindas de dentro 
    // do próprio container, ignorando as requisições encaminhadas pela ponte de rede (bridge) do host externo.
    app.listen(port, '0.0.0.0', () => {
        console.log(`Servidor Express escutando na porta ${port} em modo público.`);
    });
}

iniciarServidor();