/**
 * Script Principal - PetShop Online
 * ================================
 * Controla as interatividades gerais do site, como animações,
 * o formulário de agendamento e as máscaras de input.
 */

// ========================================
// INICIALIZAÇÃO (PONTO DE ENTRADA)
// ========================================

/**
 * Ponto de entrada principal.
 * Aguarda o HTML ser carregado para iniciar as funções de interatividade.
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando PetShop Online...")

  // Configura funções de utilidade e interatividade
  setMinDateAgendamento()
  initScrollAnimations()
  setupNavbarScroll()
  setupFormValidations()
  updateResumoAgendamento() // Chama uma vez para inicializar o resumo

  console.log("Inicialização concluída!")
})

// ========================================
// NAVEGAÇÃO E SCROLL
// ========================================

/**
 * Adiciona um efeito de sombra mais pronunciado à navbar
 * quando o usuário rola a página, melhorando o destaque
 * do menu sobre o conteúdo.
 */
function setupNavbarScroll() {
  const navbar = document.getElementById("navbar")
  if (!navbar) return // Boa prática: parar se o elemento não existir

  window.addEventListener("scroll", () => {
    // 50px é o "gatilho"
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.15)"
    } else {
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
    }
  })
}

/**
 * Usa a API 'IntersectionObserver' para adicionar a classe 'visible'
 * a elementos (como cards) quando eles entram na tela (viewport).
 * Isso permite animações de "fade-in" ou "slide-in" via CSS.
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1, // Ativa quando 10% do item está visível
    rootMargin: "0px 0px -50px 0px", // Ativa um pouco antes de o item tocar a base da tela
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        // observer.unobserve(entry.target); // Descomente se a animação deve ocorrer só uma vez
      }
    })
  }, observerOptions)

  // Aplica o observador a todos os cards e títulos de seção
  document.querySelectorAll(".card, .section-title").forEach((el) => {
    observer.observe(el)
  })
}

// ========================================
// SEÇÃO: AGENDAMENTO
// ========================================

/**
 * Define as regras de negócio para o campo de data:
 * 1. Data mínima: Hoje (não permite agendar no passado).
 * 2. Data máxima: 60 dias a partir de hoje.
 */
function setMinDateAgendamento() {
  const inputData = document.getElementById("dataAgendamento")
  if (!inputData) return

  // Formata a data de hoje para o padrão 'YYYY-MM-DD'
  const hoje = new Date()
  const dataMinima = hoje.toISOString().split("T")[0]

  // Calcula 60 dias no futuro
  const dataMaxima = new Date(hoje.getTime() + 60 * 24 * 60 * 60 * 1000)
  const dataMaximaStr = dataMaxima.toISOString().split("T")[0]

  inputData.min = dataMinima
  inputData.max = dataMaximaStr

  console.log("Data mínima de agendamento:", dataMinima)
  console.log("Data máxima de agendamento:", dataMaximaStr)
}

/**
 * Atualiza o card de "Resumo do Agendamento" em tempo real
 * conforme o usuário preenche o formulário.
 */
function updateResumoAgendamento() {
  const form = document.getElementById("agendamentoForm")
  const resumoDiv = document.getElementById("resumoAgendamento")

  if (!form || !resumoDiv) return

  // O evento 'change' é mais eficiente que 'input' para radios/selects
  form.addEventListener("change", () => {
    // Coleta os valores atuais dos campos
    const nomePet = document.getElementById("nomePet").value
    const racaPet = document.getElementById("racaPet").value
    const tipoServico = document.querySelector(
      'input[name="tipoServico"]:checked',
    )?.value
    const metodoEntrega = document.querySelector(
      'input[name="metodoEntrega"]:checked',
    )?.value
    const dataAgendamento = document.getElementById("dataAgendamento").value
    const horarioAgendamento = document.getElementById("horarioAgendamento").value

    // --- Lógica de Cálculo de Preço ---
    let valorServico = 0
    if (tipoServico === "banho-tosa") valorServico = 80.0
    if (tipoServico === "banho") valorServico = 50.0

    let valorAdicional = 0
    if (metodoEntrega === "telebusca") valorAdicional = 20.0

    const valorTotal = valorServico + valorAdicional

    // Formata a data para um formato legível (ex: "segunda-feira, 10 de ...")
    let dataFormatada = ""
    if (dataAgendamento) {
      // Adiciona 'T00:00:00' para evitar problemas de fuso horário (UTC)
      const date = new Date(dataAgendamento + "T00:00:00")
      dataFormatada = date.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    // --- Montagem do HTML do Resumo ---
    // (Usando template literals para montar o HTML dinamicamente)
    let resumoHTML = `
            <div class="resumo-item mb-3">
                <h6 class="text-muted mb-2"><i class="fas fa-paw"></i> Pet</h6>
                <p class="mb-0"><strong>${nomePet || "--"}</strong> (${
      racaPet || "--"
    })</p>
            </div>
        `

    if (tipoServico) {
      const nomeServico =
        tipoServico === "banho-tosa" ? "Banho e Tosa Completo" : "Banho Simples"
      resumoHTML += `
                <div class="resumo-item mb-3">
                    <h6 class="text-muted mb-2"><i class="fas fa-spa"></i> Serviço</h6>
                    <p class="mb-0"><strong>${nomeServico}</strong></p>
                    <p class="mb-0 small">R$ ${valorServico.toFixed(2)}</p>
                </div>
            `
    }

    if (metodoEntrega) {
      const nomeEntrega =
        metodoEntrega === "telebusca"
          ? "Tele-busca e Entrega"
          : "Entrega no Local"
      resumoHTML += `
                <div class="resumo-item mb-3">
                    <h6 class="text-muted mb-2"><i class="fas fa-truck"></i> Entrega</h6>
                    <p class="mb-0"><strong>${nomeEntrega}</strong></p>
                    ${
                      metodoEntrega === "telebusca"
                        ? '<p class="mb-0 small">+R$ 20.00</p>'
                        : ""
                    }
                </div>
            `
    }

    if (dataFormatada && horarioAgendamento) {
      resumoHTML += `
                <div class="resumo-item mb-3">
                    <h6 class="text-muted mb-2"><i class="fas fa-calendar-alt"></i> Data e Hora</h6>
                    <p class="mb-0"><strong>${dataFormatada}</strong></p>
                    <p class="mb-0"><strong>${horarioAgendamento}</strong></p>
                </div>
            `
    }

    // Só mostra o total se um serviço for selecionado
    if (tipoServico) {
      resumoHTML += `
                <hr class="my-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">Valor Total:</h6>
                    <h4 class="mb-0" style="color: var(--color-success);">R$ ${valorTotal.toFixed(
                      2,
                    )}</h4>
                </div>
            `
    }

    resumoDiv.innerHTML = resumoHTML
    console.log("Resumo atualizado - Total: R$", valorTotal.toFixed(2))
  })

  // Dispara o evento 'change' manualmente no carregamento da página
  // para garantir que o resumo seja atualizado caso o navegador
  // tenha preenchido os campos automaticamente (autocomplete).
  form.dispatchEvent(new Event("change"))
}

/**
 * Manipula o envio do formulário de agendamento (simulado).
 *
 * @param {Event} event - O evento de 'submit' do formulário.
 */
function handleAgendamento(event) {
  event.preventDefault()
  console.log("Formulário de agendamento enviado")

  const formData = new FormData(event.target)
  const dados = Object.fromEntries(formData)

  // Validação simples (apenas campos principais)
  if (
    !dados.nomePet ||
    !dados.tipoServico ||
    !dados.dataAgendamento ||
    !dados.horarioAgendamento
  ) {
    console.log("Validação falhou - campos obrigatórios faltando")
    alert("⚠️ Por favor, preencha todos os campos obrigatórios!")
    return
  }

  // Simulação de sucesso
  alert(
    `✅ Agendamento realizado com sucesso!\n\nPet: ${dados.nomePet}\nData: ${dados.dataAgendamento}\nHorário: ${dados.horarioAgendamento}\n\nVocê receberá uma confirmação no WhatsApp!`,
  )

  console.log("Dados do agendamento:", dados)

  // Limpa o formulário e atualiza o resumo (para voltar ao estado inicial)
  event.target.reset()
  updateResumoAgendamento()
}

// ========================================
// VALIDAÇÕES E MÁSCARAS DE FORMULÁRIO
// ========================================

/**
 * Função "mãe" que inicializa todas as máscaras de input.
 */
function setupFormValidations() {
  setupCPFValidation()
  setupTelefoneValidation()
  setupCEPValidation()
  setupEmailValidation()
}

/**
 * Aplica uma máscara de formatação (XXX.XXX.XXX-XX)
 * ao campo de CPF enquanto o usuário digita.
 */
function setupCPFValidation() {
  const cpfInput = document.getElementById("cpfCliente")
  if (!cpfInput) return

  cpfInput.addEventListener("input", (e) => {
    // 1. Remove tudo que não for dígito
    let value = e.target.value.replace(/\D/g, "")

    // 2. Limita a 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11)
    }

    // 3. Aplica a máscara dinamicamente
    if (value.length > 9) {
      value =
        value.substring(0, 3) +
        "." +
        value.substring(3, 6) +
        "." +
        value.substring(6, 9) +
        "-" +
        value.substring(9)
    } else if (value.length > 6) {
      value =
        value.substring(0, 3) +
        "." +
        value.substring(3, 6) +
        "." +
        value.substring(6)
    } else if (value.length > 3) {
      value = value.substring(0, 3) + "." + value.substring(3)
    }

    e.target.value = value
  })
}

/**
 * Aplica uma máscara de telefone ( (XX) 9XXXX-XXXX )
 * enquanto o usuário digita.
 */
function setupTelefoneValidation() {
  const telefoneInput = document.getElementById("telefoneCliente")
  if (!telefoneInput) return

  telefoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 11) {
      value = value.substring(0, 11)
    }

    // Aplica a máscara (XX) XXXXX-XXXX
    if (value.length > 7) {
      value =
        "(" +
        value.substring(0, 2) +
        ") " +
        value.substring(2, 7) +
        "-" +
        value.substring(7)
    } else if (value.length > 2) {
      value = "(" + value.substring(0, 2) + ") " + value.substring(2)
    }

    e.target.value = value
  })
}

/**
 * Aplica uma máscara de CEP ( XXXXX-XXX )
 * enquanto o usuário digita.
 */
function setupCEPValidation() {
  const cepInput = document.getElementById("cepCliente")
  if (!cepInput) return

  cepInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 8) {
      value = value.substring(0, 8)
    }

    // Aplica a máscara XXXXX-XXX
    if (value.length > 5) {
      value = value.substring(0, 5) + "-" + value.substring(5)
    }

    e.target.value = value
  })
}

/**
 * Valida o e-mail quando o usuário "sai" do campo (evento 'blur').
 * Adiciona a classe 'is-invalid' do Bootstrap se o formato for ruim.
 */
function setupEmailValidation() {
  const emailInputs = document.querySelectorAll('input[type="email"]')

  emailInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      const email = this.value
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

      // Só valida se o campo não estiver vazio
      if (email && !isValid) {
        this.classList.add("is-invalid") // Classe do Bootstrap
        console.log("Email inválido (blur):", email)
      } else {
        this.classList.remove("is-invalid")
      }
    })
  })
}

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

/**
 * Formata um número para o padrão de moeda BRL (Real).
 * @param {number} valor - Valor a formatar.
 * @returns {string} Valor formatado (ex: "R$ 1.234,56").
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

/**
 * Formata uma data (string YYYY-MM-DD) para o padrão brasileiro (DD/MM/YYYY).
 * @param {string} data - Data em formato YYYY-MM-DD.
 * @returns {string} Data formatada (ex: "10/11/2025").
 */
function formatarData(data) {
  // Adiciona 'T00:00:00' para garantir que a data seja interpretada em UTC
  // e evitar erros de "um dia a menos" por fuso horário.
  const date = new Date(data + "T00:00:00")
  return date.toLocaleDateString("pt-BR")
}