/**
 * Form Handler - PetShop Online
 * =============================
 * Este script cuida da validação e do envio (simulado)
 * do formulário de cadastro de clientes e pets.
 */

// ========================================
// MANIPULADORES DE FORMULÁRIO
// ========================================

/**
 * Ponto de entrada para o envio do formulário de cadastro.
 * Orquestra a coleta, validação e salvamento dos dados.
 *
 * @param {Event} event - O evento de 'submit' do formulário.
 */
function handleCadastro(event) {
  // Impede o recarregamento da página (comportamento padrão do form)
  event.preventDefault()

  console.log("Formulário de cadastro iniciando validação...")

  // Extrai os dados do formulário para um objeto simples
  const formData = new FormData(event.target)
  const dados = Object.fromEntries(formData)

  // --- Início das Validações ---

  if (!validarDadosObrigatorios(dados)) {
    console.log("Validação falhou: dados obrigatórios faltando.")
    return // Interrompe a execução se houver campos faltando
  }

  if (!validarCPF(dados.cpfCliente)) {
    alert("❌ CPF inválido! Por favor, verifique.")
    console.log("CPF inválido:", dados.cpfCliente)
    return
  }

  if (!validarEmail(dados.emailCliente)) {
    alert("❌ E-mail inválido! Por favor, verifique.")
    console.log("Email inválido:", dados.emailCliente)
    return
  }

  if (!validarTelefone(dados.telefoneCliente)) {
    alert("❌ Telefone inválido! Por favor, verifique.")
    console.log("Telefone inválido:", dados.telefoneCliente)
    return
  }

  // --- Fim das Validações ---

  // Se todas as validações passaram, salva os dados
  salvarCadastro(dados)

  alert(
    `✅ Cadastro realizado com sucesso!\n\nBem-vindo, ${dados.nomeCliente}!\n\nAgora você pode agendar serviços para ${dados.nomePetCadastro}.`,
  )

  console.log("Cadastro concluído com sucesso.")
  console.log("Dados do cliente:", dados)

  // Limpa os campos do formulário
  event.target.reset()
}

/**
 * Verifica se todos os campos definidos como obrigatórios estão preenchidos.
 *
 * @param {Object} dados - Objeto com os dados do formulário.
 * @returns {boolean} True se todos os campos obrigatórios estão preenchidos.
 */
function validarDadosObrigatorios(dados) {
  // Lista de 'names' dos inputs obrigatórios
  const camposObrigatorios = [
    "nomeCliente",
    "cpfCliente",
    "dataNascimento",
    "sexo",
    "emailCliente",
    "telefoneCliente",
    "cepCliente",
    "enderecoCliente",
    "nomePetCadastro",
    "racaPetCadastro",
    "idadePetCadastro",
    "pesoPet",
    "tipoPetCadastro",
  ]

  for (const campo of camposObrigatorios) {
    // Verifica se o campo não existe, está vazio ou só tem espaços
    if (!dados[campo] || dados[campo].trim() === "") {
      alert(`⚠️ Campo obrigatório não preenchido: ${campo}`)
      console.log("Campo faltando:", campo)
      return false
    }
  }

  return true
}

/**
 * Valida um CPF brasileiro usando o algoritmo (módulo 11).
 *
 * @param {string} cpf - O CPF para validar (pode conter pontos e traço).
 * @returns {boolean} True se o CPF for válido.
 */
function validarCPF(cpf) {
  // 1. Limpa a formatação (pontos e traço)
  cpf = cpf.replace(/[^\d]/g, "")

  // 2. Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    console.log("CPF não tem 11 dígitos")
    return false
  }

  // 3. Elimina CPFs inválidos conhecidos (dígitos repetidos)
  if (/^(\d)\1{10}$/.test(cpf)) {
    console.log("CPF com dígitos repetidos")
    return false
  }

  // 4. Validação do primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += Number.parseInt(cpf[i]) * (10 - i)
  }

  let resto = soma % 11
  const digito1 = resto < 2 ? 0 : 11 - resto

  if (Number.parseInt(cpf[9]) !== digito1) {
    console.log("Primeiro dígito verificador inválido")
    return false
  }

  // 5. Validação do segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += Number.parseInt(cpf[i]) * (11 - i)
  }

  resto = soma % 11
  const digito2 = resto < 2 ? 0 : 11 - resto

  if (Number.parseInt(cpf[10]) !== digito2) {
    console.log("Segundo dígito verificador inválido")
    return false
  }

  // Se passou por tudo, é válido
  console.log("CPF válido:", cpf)
  return true
}

/**
 * Valida o formato de um e-mail usando uma expressão regular (Regex).
 *
 * @param {string} email - O e-mail para validar.
 * @returns {boolean} True se o formato do e-mail for válido.
 */
function validarEmail(email) {
  // Regex simples: "algo@algo.algo"
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = regex.test(email)

  console.log("Validação de email:", email, "Resultado:", isValid)
  return isValid
}

/**
 * Valida se um telefone tem 10 ou 11 dígitos (com DDD).
 *
 * @param {string} telefone - O telefone para validar (pode ter máscara).
 * @returns {boolean} True se o formato for válido.
 */
function validarTelefone(telefone) {
  // Remove parênteses, espaços e traços
  const apenasNumeros = telefone.replace(/\D/g, "")

  // Valida se é um fixo (10 dígitos) ou celular (11 dígitos)
  const isValid = apenasNumeros.length === 10 || apenasNumeros.length === 11

  console.log("Validação de telefone:", telefone, "Resultado:", isValid)
  return isValid
}

/**
 * Simula um "backend" salvando os dados do cadastro no localStorage.
 * Em um projeto real, isso faria uma requisição (POST) para uma API.
 *
 * @param {Object} dados - Dados do cadastro a salvar.
 */
function salvarCadastro(dados) {
  try {
    // 1. Recupera os cadastros existentes (ou um array vazio)
    const cadastros = JSON.parse(localStorage.getItem("petshop_cadastros")) || []

    // 2. Enriquece o objeto de dados com informações de controle
    dados.dataCadastro = new Date().toISOString()
    dados.id = "cad_" + Date.now() // ID único simples

    // 3. Adiciona o novo cadastro à lista
    cadastros.push(dados)

    // 4. Salva a lista atualizada de volta no localStorage
    localStorage.setItem("petshop_cadastros", JSON.stringify(cadastros))

    console.log("Cadastro salvo no localStorage")
    console.log("Total de cadastros:", cadastros.length)
  } catch (error) {
    console.error("Erro ao salvar cadastro:", error)
    alert("❌ Erro ao salvar cadastro. Por favor, tente novamente.")
  }
}

/**
 * Função de utilidade (debug) para recuperar todos os cadastros.
 *
 * @returns {Array} Array com todos os cadastros salvos.
 */
function recuperarCadastros() {
  try {
    const cadastros = JSON.parse(localStorage.getItem("petshop_cadastros")) || []
    console.log("Cadastros recuperados:", cadastros)
    return cadastros
  } catch (error) {
    console.error("Erro ao recuperar cadastros:", error)
    return []
  }
}

/**
 * Função de utilidade (debug) para limpar o localStorage.
 * Pede confirmação antes de apagar tudo.
 */
function limparCadastros() {
  if (
    confirm(
      "⚠️ Tem certeza que deseja limpar TODOS os cadastros? Esta ação não pode ser desfeita!",
    )
  ) {
    localStorage.removeItem("petshop_cadastros")
    console.log("Todos os cadastros foram removidos")
    alert("✅ Cadastros foram limpos.")
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * O 'DOMContentLoaded' garante que o script só execute após
 * o HTML estar completamente carregado.
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Form Handler inicializado")

  // Exibe os cadastros salvos no console se estiver em ambiente de dev
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log("Modo desenvolvimento - Cadastros disponíveis:")
    recuperarCadastros()
  }

  // Nota: O 'listener' de 'submit' do formulário está no próprio HTML
  // (onsubmit="handleCadastro(event)").
  // Se não estivesse, seria adicionado aqui:
  // document.getElementById('cadastroForm').addEventListener('submit', handleCadastro);
})