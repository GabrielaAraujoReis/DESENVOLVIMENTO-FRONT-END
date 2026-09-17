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


let ultimoElementoFocado = null;


/* ======================================================
   SELEÇÃO DAS TAREFAS
====================================================== */

function selecionarTarefas(estadoAtual) {

    const termo =
        estadoAtual.busca
            .trim()
            .toLowerCase();


    const tarefasFiltradas =
        estadoAtual.tarefas

            .filter((tarefa) =>
                tarefa.titulo
                    .toLowerCase()
                    .includes(termo)
            )

            .filter((tarefa) =>
                estadoAtual.status === "todos" ||
                tarefa.status === estadoAtual.status
            )

            .filter((tarefa) =>
                estadoAtual.prioridade === "todas" ||
                tarefa.prioridade === estadoAtual.prioridade
            );


    return [...tarefasFiltradas]
        .sort((a, b) => {

            if (
                estadoAtual.ordenacao ===
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


/* ======================================================
   TEMA
====================================================== */

function renderizarTema(estadoAtual) {

    const pagina =
        document.documentElement;


    const botaoTema =
        document.querySelector(
            "[data-alternar-tema]"
        );


    pagina.dataset.theme =
        estadoAtual.tema;


    if (!botaoTema) {
        return;
    }


    const escuro =
        estadoAtual.tema === "escuro";


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


/* ======================================================
   FILTROS
====================================================== */

function renderizarPainelFiltros(estadoAtual) {

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
        !estadoAtual.filtrosAbertos;


    botao.setAttribute(
        "aria-expanded",
        String(
            estadoAtual.filtrosAbertos
        )
    );


    botao.title =
        estadoAtual.filtrosAbertos
            ? "Recolher busca e filtros"
            : "Abrir busca e filtros";
}


/* ======================================================
   MODAL
====================================================== */

function abrirModal(
    titulo,
    conteudo,
    tipo = ""
) {

    const modal =
        document.querySelector(
            "[data-modal]"
        );


    const elementoTitulo =
        document.querySelector(
            "[data-modal-titulo]"
        );


    const corpo =
        document.querySelector(
            "[data-modal-corpo]"
        );


    if (
        !modal ||
        !elementoTitulo ||
        !corpo
    ) {
        return;
    }


    ultimoElementoFocado =
        document.activeElement;


    elementoTitulo.textContent =
        titulo;


    corpo.replaceChildren(
        conteudo
    );


    modal.dataset.modalTipo =
        tipo;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    const botaoFechar =
        modal.querySelector(
            ".modal-close"
        );


    if (botaoFechar) {
        botaoFechar.focus();
    }
}


function fecharModal() {

    const modal =
        document.querySelector(
            "[data-modal]"
        );


    const corpo =
        document.querySelector(
            "[data-modal-corpo]"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    modal.dataset.modalTipo =
        "";


    document.body.classList.remove(
        "modal-open"
    );


    if (corpo) {
        corpo.replaceChildren();
    }


    if (
        ultimoElementoFocado instanceof HTMLElement
    ) {

        ultimoElementoFocado.focus();
    }


    ultimoElementoFocado =
        null;
}


function instalarEventosDoModal() {

    const modal =
        document.querySelector(
            "[data-modal]"
        );


    if (!modal) {
        return;
    }


    modal.addEventListener(
        "click",
        (evento) => {

            if (
                !(evento.target instanceof Element)
            ) {
                return;
            }


            const fechar =
                evento.target.closest(
                    "[data-fechar-modal]"
                );


            if (!fechar) {
                return;
            }


            fecharModal();
        }
    );


    document.addEventListener(
        "keydown",
        (evento) => {

            if (
                evento.key === "Escape" &&
                !modal.hidden
            ) {

                fecharModal();
            }
        }
    );
}


/* ======================================================
   FASES DA PLANTA
====================================================== */

function criarFasesDaPlanta() {

    const container =
        document.createElement("div");


    container.className =
        "plant-stages";


    container.innerHTML = `

        <article class="plant-stage">

            <div class="plant-stage-drawing">

                <svg
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                >

                    <ellipse
                        cx="32"
                        cy="43"
                        rx="9"
                        ry="5"
                        class="plant-seed"
                    ></ellipse>

                </svg>

            </div>


            <div class="plant-stage-info">

                <strong>
                    0% – 24%
                </strong>

                <span>
                    Semente
                </span>

            </div>

        </article>


        <article class="plant-stage">

            <div class="plant-stage-drawing">

                <svg
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                >

                    <path
                        d="M23 47 H41 L38 56 H26 Z"
                        class="stage-pot"
                    ></path>

                    <path
                        d="M32 47 V30"
                        class="stage-stem"
                    ></path>

                    <path
                        d="
                            M32 38
                            C23 38 21 31 22 27
                            C28 28 32 31 32 38Z
                        "
                        class="stage-leaf"
                    ></path>

                </svg>

            </div>


            <div class="plant-stage-info">

                <strong>
                    25% – 49%
                </strong>

                <span>
                    Broto
                </span>

            </div>

        </article>


        <article class="plant-stage">

            <div class="plant-stage-drawing">

                <svg
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                >

                    <path
                        d="M23 47 H41 L38 56 H26 Z"
                        class="stage-pot"
                    ></path>

                    <path
                        d="M32 47 V24"
                        class="stage-stem"
                    ></path>

                    <path
                        d="
                            M32 39
                            C22 39 20 31 21 27
                            C28 28 32 32 32 39Z
                        "
                        class="stage-leaf"
                    ></path>

                    <path
                        d="
                            M32 32
                            C42 32 44 25 43 21
                            C36 22 32 25 32 32Z
                        "
                        class="stage-leaf"
                    ></path>

                </svg>

            </div>


            <div class="plant-stage-info">

                <strong>
                    50% – 74%
                </strong>

                <span>
                    Muda
                </span>

            </div>

        </article>


        <article class="plant-stage">

            <div class="plant-stage-drawing">

                <svg
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                >

                    <path
                        d="M23 47 H41 L38 56 H26 Z"
                        class="stage-pot"
                    ></path>

                    <path
                        d="M32 47 V18"
                        class="stage-stem"
                    ></path>

                    <path
                        d="
                            M32 40
                            C21 40 19 31 20 27
                            C28 28 32 32 32 40Z
                        "
                        class="stage-leaf"
                    ></path>

                    <path
                        d="
                            M32 32
                            C43 32 45 24 44 20
                            C36 21 32 24 32 32Z
                        "
                        class="stage-leaf"
                    ></path>

                    <path
                        d="
                            M32 25
                            C24 24 23 17 24 14
                            C29 15 32 18 32 25Z
                        "
                        class="stage-leaf"
                    ></path>

                </svg>

            </div>


            <div class="plant-stage-info">

                <strong>
                    75% – 99%
                </strong>

                <span>
                    Crescendo
                </span>

            </div>

        </article>


        <article class="plant-stage">

            <div class="plant-stage-drawing">

                <svg
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                >

                    <path
                        d="M23 47 H41 L38 56 H26 Z"
                        class="stage-pot"
                    ></path>

                    <path
                        d="M32 47 V17"
                        class="stage-stem"
                    ></path>

                    <path
                        d="
                            M32 40
                            C20 40 18 31 19 26
                            C28 27 32 31 32 40Z
                        "
                        class="stage-leaf"
                    ></path>

                    <path
                        d="
                            M32 33
                            C44 33 46 24 45 19
                            C36 20 32 24 32 33Z
                        "
                        class="stage-leaf"
                    ></path>

                    <path
                        d="
                            M32 26
                            C23 25 22 17 23 13
                            C29 14 32 18 32 26Z
                        "
                        class="stage-leaf"
                    ></path>

                    <path
                        d="
                            M32 21
                            C40 20 42 13 41 10
                            C35 10 32 14 32 21Z
                        "
                        class="stage-leaf"
                    ></path>

                </svg>

            </div>


            <div class="plant-stage-info">

                <strong>
                    100%
                </strong>

                <span>
                    Planta completa
                </span>

            </div>

        </article>
    `;


    return container;
}


function abrirFasesDaPlanta() {

    abrirModal(
        "Fases da planta",
        criarFasesDaPlanta(),
        "planta"
    );
}


/* ======================================================
   DETALHES DA TAREFA
====================================================== */

function formatarStatus(status) {

    if (status === "a-fazer") {
        return "A fazer";
    }


    if (status === "em-andamento") {
        return "Em andamento";
    }


    if (status === "em-revisao") {
        return "Em revisão";
    }


    return "Concluída";
}


function formatarPrioridade(prioridade) {

    if (prioridade === "alta") {
        return "Alta";
    }


    if (prioridade === "media") {
        return "Média";
    }


    return "Baixa";
}


function abrirDetalhesTarefa(tarefa) {

    const detalhes =
        document.createElement("div");


    detalhes.className =
        "task-modal-details";


    const descricao =
        document.createElement("p");


    descricao.className =
        "task-modal-description";


    descricao.textContent =
        tarefa.descricao;


    const lista =
        document.createElement("dl");


    lista.className =
        "task-modal-list";


    const dados = [
        [
            "Status",
            formatarStatus(
                tarefa.status
            )
        ],
        [
            "Prioridade",
            formatarPrioridade(
                tarefa.prioridade
            )
        ],
        [
            "Prazo",
            tarefa.prazo
        ]
    ];


    for (
        const [rotulo, valor]
        of dados
    ) {

        const termo =
            document.createElement("dt");


        termo.textContent =
            rotulo;


        const descricaoDado =
            document.createElement("dd");


        descricaoDado.textContent =
            valor;


        lista.append(
            termo,
            descricaoDado
        );
    }


    detalhes.append(
        descricao,
        lista
    );


    abrirModal(
        tarefa.titulo,
        detalhes,
        "tarefa"
    );
}


/* ======================================================
   PRAZOS DA SEMANA
====================================================== */

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


/* ======================================================
   PLANTA
====================================================== */

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


            let limite =
                100;


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


/* ======================================================
   RESUMO
====================================================== */

function renderizarResumo(estadoAtual) {

    const total =
        estadoAtual.tarefas.length;


    const concluidas =
        estadoAtual.tarefas.filter(
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
            estadoAtual.tarefas
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


/* ======================================================
   RENDERIZAÇÃO GERAL
====================================================== */

function renderizarAplicacao(
    estadoAtual
) {

    renderizarTema(
        estadoAtual
    );


    renderizarPainelFiltros(
        estadoAtual
    );


    if (
        estadoAtual.carregamento ===
        "carregando"
    ) {

        renderizarEstado(
            "carregando"
        );

        return;
    }


    if (
        estadoAtual.carregamento ===
        "erro"
    ) {

        renderizarEstado(
            "erro",
            estadoAtual.erro
        );

        return;
    }


    renderizarResumo(
        estadoAtual
    );


    if (
        estadoAtual.tarefas.length === 0
    ) {

        renderizarEstado(
            "vazio",
            []
        );

        return;
    }


    const tarefasVisiveis =
        selecionarTarefas(
            estadoAtual
        );


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
            `${tarefasVisiveis.length} de ${estadoAtual.tarefas.length} tarefa(s).`;
    }
}


/* ======================================================
   INICIALIZAÇÃO
====================================================== */

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


    const botaoFases =
        document.querySelector(
            "[data-abrir-fases]"
        );


    if (!quadro) {

        throw new Error(
            "Quadro de tarefas não encontrado."
        );
    }


    instalarEventosDoModal();


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


    if (botaoFases) {

        botaoFases.addEventListener(
            "click",
            abrirFasesDaPlanta
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
            estado.tarefas,
            abrirDetalhesTarefa
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

                    estado.busca =
                        "";


                    estado.status =
                        "todos";


                    estado.prioridade =
                        "todas";


                    estado.ordenacao =
                        "prazo-asc";


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