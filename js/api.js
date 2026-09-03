export async function carregarTarefas() {
    const resposta = await fetch("./dados.json");

    if (!resposta.ok) {
        throw new Error(`Resposta HTTP ${resposta.status}`);
    }

    const documento = await resposta.json();

    return documento.tarefas;
}
