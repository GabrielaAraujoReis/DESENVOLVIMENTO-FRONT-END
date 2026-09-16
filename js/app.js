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
    erro: null,
    tema: "claro",
    filtrosAbertos: true
};


function selecionarTarefas(estado) {

    const termo =
        estado.busca
            .trim()
            .toLowerCase();


    const tarefasFiltradas =
        estado.tarefas

            .filter((tarefa) =>
                tarefa.titulo
                    .toLowerCase()
                    .includes(termo)
            )

            .filter((tarefa) =>
                estado.status === "todos" ||
                tarefa.status === estado.status
            )

            .filter((tarefa) =>
                estado.prioridade === "todas" ||
                tarefa.prioridade === estado.prioridade
            );


    return [...tarefasFiltradas]
        .sort((a, b) => {

            if (
                estado.ordenacao ===
                "prazo-desc"
            ) {

                return b.prazo.localeCompare(
                    a.prazo
                );
            }

            return a.prazo.localeCompare(
                b.prazo
            );
        });
}


function renderizarTema(estado) {

    const pagina =
        document.documentElement;


    const botaoTema =
        document.querySelector(
            "[data-alternar-tema]"
        );


    pagina.dataset.theme =
        estado.tema;


    if (!botaoTema) {
        return;
    }


    const escuro =
        estado.tema === "escuro";


    botaoTema.setAttribute(
        "aria-pressed",
        String(escuro)
    );


    botaoTema.setAttribute(
        "aria-label",
        escuro
            ? "Ativar modo claro"
            : "Ativar modo escuro"
    );


    botaoTema.title =
        escuro
            ? "Ativar modo claro"
            : "Ativar modo escuro";
}


function renderizarPainelFiltros(estado) {

    const conteudo =
        document.querySelector(
            "[data-conteudo-filtros]"
        );


    const botao =
        document.querySelector(
            "[data-alternar-filtros]"
        );


    if (!conteudo || !botao) {
        return;
    }


    conteudo.hidden =
        !estado.filtrosAbertos;


    botao.setAttribute(
        "aria-expanded",
        String(estado.filtrosAbertos)
    );


    botao.title =
        estado.filtrosAbertos
            ? "Recolher busca e filtros"
            : "Abrir busca e filtros";
}


function calcularPrazosDaSemana(tarefas) {

    const hoje =
        new Date();


    hoje.setHours(
        0,
        0,
        0,
        0
    );


    const diaSemana =
        hoje.getDay();


    const distanciaSegunda =
        diaSemana === 0
            ? -6
            : 1 - diaSemana;


    const inicioSemana =
        new Date(hoje);


    inicioSemana.setDate(
        hoje.getDate() +
        distanciaSegunda
    );


    const fimSemana =
        new Date(inicioSemana);


    fimSemana.setDate(
        inicioSemana.getDate() + 6
    );


    fimSemana.setHours(
        23,
        59,
        59,
        999
    );


    return tarefas.filter(
        (tarefa) => {

            if (
                tarefa.status ===
                "concluida"
            ) {
                return false;
            }


            const prazo =
                new Date(
                    `${tarefa.prazo}T00:00:00`
                );


            return (
                prazo >= inicioSemana &&
                prazo <= fimSemana
            );
        }
    ).length;
}


function renderizarPlanta(percentual) {

    const caule =
        document.querySelector(
            "[data-planta-caule]"
        );


    const folhas =
        document.querySelectorAll(
            "[data-planta-folha]"
        );


    if (!caule) {
        return;
    }


    caule.classList.toggle(
        "visible",
        percentual >= 10
    );


    folhas.forEach(
        (folha) => {

            const numero =
                Number(
                    folha.dataset.plantaFolha
                );


            let limite = 100;


            if (numero === 1) {
                limite = 25;
            }

            if (numero === 2) {
                limite = 50;
            }

            if (numero === 3) {
                limite = 75;
            }

            if (numero === 4) {
                limite = 100;
            }


            folha.classList.toggle(
                "visible",
                percentual >= limite
            );
        }
    );
}


function renderizarResumo(estado) {

    const total =
        estado.tarefas.length;


    const concluidas =
        estado.tarefas.filter(
            (tarefa) =>
                tarefa.status ===
                "concluida"
        ).length;


    const pendentes =
        total - concluidas;


    const percentual =
        total === 0
            ? 0
            : Math.round(
                (concluidas / total) * 100
            );


    const prazosSemana =
        calcularPrazosDaSemana(
            estado.tarefas
        );


    const elementoTotal =
        document.querySelector(
            "[data-total-tarefas]"
        );


    const elementoPendentes =
        document.querySelector(
            "[data-tarefas-pendentes]"
        );


    const elementoConcluidas =
        document.querySelector(
            "[data-tarefas-concluidas]"
        );


    const elementoPrazos =
        document.querySelector(
            "[data-prazos-semana]"
        );


    const elementoPercentual =
        document.querySelector(
            "[data-progresso-percentual]"
        );


    const circulo =
        document.querySelector(
            "[data-progresso-circular]"
        );


    if (elementoTotal) {
        elementoTotal.textContent =
            total;
    }


    if (elementoPendentes) {
        elementoPendentes.textContent =
            pendentes;
    }


    if (elementoConcluidas) {
        elementoConcluidas.textContent =
            concluidas;
    }


    if (elementoPrazos) {
        elementoPrazos.textContent =
            prazosSemana;
    }


    if (elementoPercentual) {
        elementoPercentual.textContent =
            `${percentual}%`;
    }


    if (circulo) {

        const graus =
            percentual * 3.6;


        circulo.style.setProperty(
            "--progress",
            `${graus}deg`
        );


        circulo.setAttribute(
            "aria-label",
            `Progresso geral: ${percentual}%`
        );
    }


    renderizarPlanta(
        percentual
    );
}


function renderizarAplicacao(estado) {

    renderizarTema(estado);
    renderizarPainelFiltros(estado);


    if (
        estado.carregamento ===
        "carregando"
    ) {

        renderizarEstado(
            "carregando"
        );

        return;
    }


    if (
        estado.carregamento ===
        "erro"
    ) {

        renderizarEstado(
            "erro",
            estado.erro
        );

        return;
    }


    renderizarResumo(estado);


    if (
        estado.tarefas.length === 0
    ) {

        renderizarEstado(
            "vazio",
            []
        );

        return;
    }


    const tarefasVisiveis =
        selecionarTarefas(estado);


    if (
        tarefasVisiveis.length === 0
    ) {

        renderizarEstado(
            "resultado-vazio"
        );

        return;
    }


    renderizarEstado(
        "sucesso",
        tarefasVisiveis
    );


    const painelEstado =
        document.querySelector(
            "[data-estado]"
        );


    if (painelEstado) {

        painelEstado.textContent =
            `${tarefasVisiveis.length} de ${estado.tarefas.length} tarefa(s).`;
    }
}


async function iniciarAplicacao() {

    const quadro =
        document.querySelector(
            "[data-quadro]"
        );


    const campoBusca =
        document.querySelector(
            "#busca-titulo"
        );


    const filtroStatus =
        document.querySelector(
            "#filtro-status"
        );


    const filtroPrioridade =
        document.querySelector(
            "#filtro-prioridade"
        );


    const campoOrdenacao =
        document.querySelector(
            "#ordenacao"
        );


    const formulario =
        document.querySelector(
            ".filters-panel form"
        );


    const botaoTema =
        document.querySelector(
            "[data-alternar-tema]"
        );


    const botaoFiltros =
        document.querySelector(
            "[data-alternar-filtros]"
        );


    if (!quadro) {
        throw new Error(
            "Quadro de tarefas não encontrado."
        );
    }


    if (botaoTema) {

        botaoTema.addEventListener(
            "click",
            () => {

                estado.tema =
                    estado.tema === "claro"
                        ? "escuro"
                        : "claro";


                renderizarAplicacao(
                    estado
                );
            }
        );
    }


    if (botaoFiltros) {

        botaoFiltros.addEventListener(
            "click",
            () => {

                estado.filtrosAbertos =
                    !estado.filtrosAbertos;


                renderizarAplicacao(
                    estado
                );
            }
        );
    }


    estado.carregamento =
        "carregando";


    estado.erro =
        null;


    renderizarAplicacao(
        estado
    );


    try {

        const tarefas =
            await carregarTarefas();


        estado.tarefas =
            tarefas;


        estado.carregamento =
            "sucesso";


        estado.erro =
            null;


        renderizarAplicacao(
            estado
        );


        instalarEventosDoQuadro(
            quadro,
            estado.tarefas
        );


        if (campoBusca) {

            campoBusca.addEventListener(
                "input",
                (evento) => {

                    estado.busca =
                        evento.currentTarget.value;


                    renderizarAplicacao(
                        estado
                    );
                }
            );
        }


        if (filtroStatus) {

            filtroStatus.addEventListener(
                "change",
                (evento) => {

                    estado.status =
                        evento.currentTarget.value;


                    renderizarAplicacao(
                        estado
                    );
                }
            );
        }


        if (filtroPrioridade) {

            filtroPrioridade.addEventListener(
                "change",
                (evento) => {

                    estado.prioridade =
                        evento.currentTarget.value;


                    renderizarAplicacao(
                        estado
                    );
                }
            );
        }


        if (campoOrdenacao) {

            campoOrdenacao.addEventListener(
                "change",
                (evento) => {

                    estado.ordenacao =
                        evento.currentTarget.value;


                    renderizarAplicacao(
                        estado
                    );
                }
            );
        }


        if (formulario) {

            formulario.addEventListener(
                "submit",
                (evento) => {

                    evento.preventDefault();
                }
            );


            formulario.addEventListener(
                "reset",
                () => {

                    estado.busca = "";
                    estado.status = "todos";
                    estado.prioridade = "todas";
                    estado.ordenacao = "prazo-asc";


                    setTimeout(
                        () => {

                            renderizarAplicacao(
                                estado
                            );

                        },
                        0
                    );
                }
            );
        }

    } catch (erro) {

        estado.carregamento =
            "erro";


        if (
            erro.name ===
            "TypeError"
        ) {

            estado.erro =
                "Não foi possível conectar à rede.";

        } else if (
            erro.name ===
            "SyntaxError"
        ) {

            estado.erro =
                "Os dados recebidos estão em um formato inválido.";

        } else {

            estado.erro =
                erro.message;
        }


        renderizarAplicacao(
            estado
        );
    }
}


iniciarAplicacao();