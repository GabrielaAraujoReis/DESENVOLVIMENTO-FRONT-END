import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { instalarEventosDoQuadro } from "./renderizacao.js";

const estado = {
    tarefas: [],
    busca: "",
    status: "todos",
    prioridade: "todas",
    ordenacao: "prazo-asc",
    carregamento: "carregando",
    erro: null
};

function selecionarTarefas(estado) {
    const termo = estado.busca.trim().toLowerCase();

    const tarefasFiltradas = estado.tarefas
        .filter((tarefa) =>
            tarefa.titulo.toLowerCase().includes(termo)
        )
        .filter((tarefa) =>
            estado.status === "todos" ||
            tarefa.status === estado.status
        )
        .filter((tarefa) =>
            estado.prioridade === "todas" ||
            tarefa.prioridade === estado.prioridade
        );

    const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) => {
        if (estado.ordenacao === "prazo-desc") {
            return b.prazo.localeCompare(a.prazo);
        }

        return a.prazo.localeCompare(b.prazo);
    });

    return tarefasOrdenadas;
}

function renderizarAplicacao(estado) {
    if (estado.carregamento === "carregando") {
        renderizarEstado("carregando");
        return;
    }

    if (estado.carregamento === "erro") {
        renderizarEstado("erro", estado.erro);
        return;
    }

    if (estado.tarefas.length === 0) {
        renderizarEstado("vazio", []);
        return;
    }

    const tarefasVisiveis = selecionarTarefas(estado);

    renderizarEstado("sucesso", tarefasVisiveis);
}

async function iniciarAplicacao() {
    const quadro = document.querySelector("[data-quadro]");
    const campoBusca = document.querySelector("#busca-titulo");

    if (!quadro) {
        throw new Error("Quadro de tarefas não encontrado.");
    }

    estado.carregamento = "carregando";
    estado.erro = null;

    renderizarAplicacao(estado);

    try {
        const tarefas = await carregarTarefas();

        estado.tarefas = tarefas;
        estado.carregamento = "sucesso";
        estado.erro = null;

        renderizarAplicacao(estado);

        instalarEventosDoQuadro(quadro, estado.tarefas);

        if (campoBusca) {
            campoBusca.addEventListener("input", (evento) => {
                estado.busca = evento.currentTarget.value;
                renderizarAplicacao(estado);
            });
        }
    } catch (erro) {
        estado.carregamento = "erro";

        if (erro.name === "TypeError") {
            estado.erro = "Não foi possível conectar à rede.";
        } else if (erro.name === "SyntaxError") {
            estado.erro =
                "Os dados recebidos estão em um formato inválido.";
        } else {
            estado.erro = erro.message;
        }

        renderizarAplicacao(estado);
    }
}

iniciarAplicacao();