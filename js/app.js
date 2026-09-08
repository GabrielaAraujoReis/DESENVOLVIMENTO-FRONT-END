import { carregarTarefas } from "./api.js";

import {
    renderizarTarefas,
    instalarEventosDoQuadro
} from "./renderizacao.js";

async function iniciarAplicacao() {
    const quadro = document.querySelector("[data-quadro]");

    if (!quadro) {
        throw new Error("Quadro de tarefas não encontrado.");
    }

    try {
        const tarefas = await carregarTarefas();

        renderizarTarefas(tarefas, quadro);
        instalarEventosDoQuadro(quadro, tarefas);
    } catch (erro) {
        console.error("Erro ao carregar tarefas:", erro);
    }
}

iniciarAplicacao();