import { renderizarTarefas } from "./renderizacao.js";

export function renderizarEstado(estado, dados) {
    const painelEstado = document.querySelector("[data-estado]");
    const quadro = document.querySelector("[data-quadro]");

    if (!painelEstado) {
        throw new Error("Região de status não encontrada.");
    }

    if (!quadro) {
        throw new Error("Quadro de tarefas não encontrado.");
    }

    if (estado === "carregando") {
        renderizarTarefas([], quadro);
        painelEstado.textContent = "Carregando tarefas...";
        return;
    }

    if (estado === "sucesso") {
        renderizarTarefas(dados, quadro);

        painelEstado.textContent =
            `${dados.length} tarefa(s) carregada(s).`;

        return;
    }

    if (estado === "vazio") {
        renderizarTarefas([], quadro);

        painelEstado.textContent =
            "Nenhuma tarefa disponível no momento.";

        return;
    }

    if (estado === "erro") {
        renderizarTarefas([], quadro);

        painelEstado.textContent = dados;

        return;
    }
}