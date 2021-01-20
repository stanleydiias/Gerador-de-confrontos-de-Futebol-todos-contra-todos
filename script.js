let classificacao = {};

function gerar(){
    classificacao = {};
    // Obtem String do TextArea e faz um split para separa por linha.
    const listTimesSemFormatacao = window.document.getElementById('times').value.split('\n');
    const listTimesFormatado = formatacao(listTimesSemFormatacao);
    console.log('listTimesFormatado', listTimesFormatado);

    let listRodadas = gerarRodadas(listTimesFormatado);
    listRodadas = gerarSegundoTurno(listRodadas);
    console.log('listRodadas', listRodadas);

    const listRodadasResultado = gerarResultados(listRodadas);
    console.log('listRodadasResultado', listRodadasResultado);

    mostrarJogos(listRodadasResultado);
    mostrarTabela(classificacao);
}

function formatacao(listTimesSemFormatacao){
    const listTimesFormatado = [];
    // Ler lista separada por linha
    for(var i = 0; i < listTimesSemFormatacao.length; i++){
        // Faz split usando ; para pegar nome e local
        const listTimeCidade = listTimesSemFormatacao[i].split(';');
        // Cria objeto 'time'
        const time = {
            nome: listTimeCidade[0],
            cidade: listTimeCidade[1]
        };
        // Adiona 'time na lista
        listTimesFormatado.push(time);
    }
    return listTimesFormatado;
}

function gerarRodadas(listTimesFormatado){
    const listRodadas = {};
    const cacheJogos = {};
    for (let i = 0; i < listTimesFormatado.length; i++) {
        let rodada = 1;
        const timeMandante = listTimesFormatado[i];

        for (let j = 0; j < listTimesFormatado.length; j++) {
            const timeVisitante = listTimesFormatado[j];
            if(timeMandante.nome === timeVisitante.nome){
                continue;
            }
            if(verificarMandanteNaRodada(cacheJogos, rodada, timeMandante)){
                rodada++;
                continue;
            }
            if(verificarVisitanteNaRodada(cacheJogos, rodada, timeVisitante)){
                continue;
            }
            
            if(!listRodadas[rodada]){
                listRodadas[rodada] = {
                    rodada,
                    jogos: []
                };
            }

            listRodadas[rodada].jogos.push({
                timeMandante,
                timeVisitante,
                cidade: timeMandante.cidade
            });

            addCacheJogos(cacheJogos, rodada, timeMandante, timeVisitante);
            rodada++;
        }
    }
    return Object.keys(listRodadas).map(key => listRodadas[key]);
}

function gerarSegundoTurno(listRodadas){
    const listaSegundoTurno = [];
    let rodadasCount = listRodadas.length;
    listRodadas.forEach(rodada => {
        const jogosSegundoTurno = rodada.jogos.map(jogo => {
            const jogoCopia = Object.assign({}, jogo);
            return {
                timeMandante: Object.assign({}, jogoCopia.timeVisitante),
                timeVisitante: Object.assign({}, jogoCopia.timeMandante),
                cidade: jogoCopia.timeVisitante.cidade
            }
        });
        listaSegundoTurno.push({
            rodada: ++rodadasCount,
            jogos: jogosSegundoTurno
        });
    });
    listRodadas.push(...listaSegundoTurno);
    return listRodadas;
}

function addCacheJogos(cacheJogos, rodada, timeMandante, timeVisitante){
    cacheJogos[rodada + timeMandante.nome] = true;
    cacheJogos[rodada + timeVisitante.nome] = true;
    cacheJogos[timeMandante.nome + timeVisitante.nome] = true;
    cacheJogos[timeVisitante.nome + timeMandante.nome] = true;
}

function verificarMandanteNaRodada(cacheJogos, rodada, timeMandante){
    return cacheJogos.hasOwnProperty(rodada + timeMandante.nome);
}

function verificarVisitanteNaRodada(cacheJogos, rodada, timeVisitante){
    return cacheJogos.hasOwnProperty(rodada + timeVisitante.nome);
}

function verificarJogoExistente(cacheJogos, timeMandante, timeVisitante){
    return cacheJogos.hasOwnProperty(timeMandante.nome + timeVisitante.nome)
    || cacheJogos.hasOwnProperty(timeVisitante.nome + timeMandante.nome);
}

function gerarGols() {
    return Math.floor(Math.random() * (4 - 0 + 1) + 0);
}

function gerarResultados(listRodadas){
    listRodadas.forEach(rodada => {
        rodada.jogos.forEach(jogo => {
            criarClassificacao(jogo.timeMandante);
            criarClassificacao(jogo.timeVisitante);

            jogo.timeMandante.gols = gerarGols();
            jogo.timeVisitante.gols = gerarGols();

            if(jogo.timeMandante.gols == jogo.timeVisitante.gols){
                jogo.vencedor = null; 
                classificacao[jogo.timeMandante.nome].pontos += 1;
                classificacao[jogo.timeVisitante.nome].pontos += 1;

            }else if (jogo.timeMandante.gols > jogo.timeVisitante.gols){
                jogo.vencedor = jogo.timeMandante.nome;
                classificacao[jogo.timeMandante.nome].pontos += 3;
            
            }else{
                jogo.vencedor = jogo.timeVisitante.nome;
                classificacao[jogo.timeVisitante.nome].pontos += 3;
            }
            classificacao[jogo.timeMandante.nome].gols += jogo.timeMandante.gols;
            classificacao[jogo.timeVisitante.nome].gols += jogo.timeVisitante.gols;
        });
    });
    return listRodadas;
}

function criarClassificacao(time){
    if(!classificacao[time.nome]){
        classificacao[time.nome] = {
            pontos: 0,
            gols: 0,
            time
        }
    }
}

function mostrarJogos(listRodadasResultado){
    let stringTable = `<tbody>`;
    listRodadasResultado.forEach(rodada => {
        stringTable += `<tr><td colspan="6" align="center">Rodada ${rodada.rodada}</td></tr>`;

        rodada.jogos.forEach(jogo => {
            stringTable += `<tr>
            <td>${jogo.cidade}</td>
            <td>${jogo.timeMandante.nome}</td>
            <td>${jogo.timeMandante.gols}</td>
            <td>x</td>
            <td>${jogo.timeVisitante.gols}</td>
            <td>${jogo.timeVisitante.nome}</td>
            </tr>`;
        });
    });

    stringTable += `</tbody>`;
    const tableResultados = window.document.getElementById('tabelaJogos');
    tableResultados.innerHTML = stringTable;
}

function mostrarTabela(classificacao){
    let listClassificacao = Object.keys(classificacao).map(key => classificacao[key]);
    listClassificacao.sort((a, b) => {
        if(a.pontos < b.pontos){
            return 1;
        }
        if(a.pontos > b.pontos){
            return -1;
        }
        if(a.pontos == b.pontos){
            if(a.gols > b.gols){
                return -1;
            }else{
                return 1;
            }
        }
        return 0;
    });
    
    let stringTable = "";
    let posicao = 1;
    listClassificacao.forEach(classificacao => {
        stringTable += `
        <tr ${posicao==1? 'class="time-campeao"' : ''}>
            <td align="center">${posicao}</td>
            <td>${classificacao.time.nome}</td>
            <td align="center">${classificacao.pontos}</td>
            <td align="center">${classificacao.gols}</td>
        </tr>`;
        posicao++;
    });

    const tableClassificacao = window.document.getElementById('tabelaClassificacao');
    tableClassificacao.innerHTML = stringTable;

    const mensagemCampeao = window.document.getElementById('mensagemCampeao');
    mensagemCampeao.innerText = `Parabéns ${listClassificacao[0].time.nome}!`;
}