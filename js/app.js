import { tarefas } from "./dados.js";

import {
    renderizarTarefas,
    instalarEventosDoQuadro
} from "./renderizacao.js";

function iniciarAplicacao() {
    const quadro = document.querySelector("[data-quadro]");

    if (!quadro) {
        throw new Error("Quadro de tarefas não encontrado.");
    }

    renderizarTarefas(tarefas, quadro);
    instalarEventosDoQuadro(quadro, tarefas);
}

iniciarAplicacao();
