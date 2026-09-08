import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { instalarEventosDoQuadro } from "./renderizacao.js";

async function iniciarAplicacao() {
    const quadro = document.querySelector("[data-quadro]");

    if (!quadro) {
        throw new Error("Quadro de tarefas não encontrado.");
    }

    renderizarEstado("carregando");

    try {
        const tarefas = await carregarTarefas();

        if (tarefas.length === 0) {
            renderizarEstado("vazio", []);
            return;
        }

        renderizarEstado("sucesso", tarefas);

        instalarEventosDoQuadro(quadro, tarefas);
    } catch (erro) {
        if (erro.name === "TypeError") {
            renderizarEstado(
                "erro",
                "Não foi possível conectar à rede."
            );
            return;
        }

        if (erro.name === "SyntaxError") {
            renderizarEstado(
                "erro",
                "Os dados recebidos estão em um formato inválido."
            );
            return;
        }

        renderizarEstado(
            "erro",
            erro.message
        );
    }
}

iniciarAplicacao();