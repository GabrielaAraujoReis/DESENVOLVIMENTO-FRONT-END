const statusDisponiveis = [
    "a-fazer",
    "em-andamento",
    "em-revisao",
    "concluida"
];

function formatarPrioridade(prioridade) {
    if (prioridade === "alta") {
        return "Alta";
    }

    if (prioridade === "media") {
        return "Média";
    }

    return "Baixa";
}

function criarCartao(tarefa) {
    const item = document.createElement("li");

    const cartao = document.createElement("article");
    cartao.className = "task-card";
    cartao.dataset.tarefaId = tarefa.id;

    const cabecalho = document.createElement("header");
    cabecalho.className = "task-card-header";

    const titulo = document.createElement("h4");
    titulo.textContent = tarefa.titulo;
    titulo.title = tarefa.titulo;

    const prioridade = document.createElement("span");
    prioridade.className = `priority priority-${tarefa.prioridade}`;
    prioridade.textContent = formatarPrioridade(tarefa.prioridade);

    cabecalho.append(titulo, prioridade);

    const prazo = document.createElement("p");
    prazo.className = "deadline";

    const textoPrazo = document.createElement("strong");
    textoPrazo.textContent = "Prazo: ";

    const data = document.createElement("time");
    data.dateTime = tarefa.prazo;
    data.textContent = tarefa.prazo;

    prazo.append(textoPrazo, data);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.acao = "ver-detalhes";

    const textoBotao = document.createElement("span");
    textoBotao.textContent = "Ver detalhes";

    botao.append(textoBotao);

    cartao.append(cabecalho, prazo, botao);

    item.append(cartao);

    return item;
}

export function renderizarTarefas(tarefas, quadro) {
    for (const status of statusDisponiveis) {
        const lista = quadro.querySelector(
            `[data-lista-status="${status}"]`
        );

        if (!lista) {
            continue;
        }

        const tarefasDoStatus = tarefas.filter(
            (tarefa) => tarefa.status === status
        );

        const cartoes = tarefasDoStatus.map(criarCartao);

        lista.replaceChildren(...cartoes);
    }
}

export function instalarEventosDoQuadro(quadro, tarefas) {
    quadro.addEventListener("click", (evento) => {
        if (!(evento.target instanceof Element)) {
            return;
        }

        const botao = evento.target.closest(
            'button[data-acao="ver-detalhes"]'
        );

        if (!botao || !quadro.contains(botao)) {
            return;
        }

        const cartao = botao.closest("[data-tarefa-id]");

        if (!cartao) {
            return;
        }

        const tarefa = tarefas.find(
            (item) => item.id === cartao.dataset.tarefaId
        );

        if (!tarefa) {
            return;
        }

        console.log("Detalhes da tarefa:", tarefa);
    });
}
