const modal = document.querySelector('.modal-container'); // Seleciona o elemento do modal na interface
const tbody = document.querySelector('tbody'); // Seleciona o elemento tbody na interface
const sNome = document.querySelector('#m-nome'); // Seleciona o elemento input com id "m-nome" na interface
const sFuncao = document.querySelector('#m-funcao'); // Seleciona o elemento input com id "m-funcao" na interface
const sSalario = document.querySelector('#m-salario'); // Seleciona o elemento input com id "m-salario" na interface
const btnSalvar = document.querySelector('#btnSalvar'); // Seleciona o elemento button com id "btnSalvar" na interface

const apiUrl = 'http://localhost:3000/itens'; // Define a URL da API

let itens; // Variável para armazenar os itens
let id; // Variável para armazenar o ID do item atualmente em edição (quando aplicável)

function openModal(edit = false, index = 0) {
  modal.classList.add('active'); // Adiciona a classe 'active' para exibir o modal

  modal.onclick = (e) => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active'); // Remove a classe 'active' para fechar o modal ao clicar fora dele
    }
  };
  
  if (edit) {     
    sNome.value = itens[index].nome; // Define o valor do input de nome com base no item em edição
    sFuncao.value = itens[index].funcao; // Define o valor do input de função com base no item em edição
    sSalario.value = itens[index].salario; // Define o valor do input de salário com base no item em edição
    id = itens[index].id; // Define o ID do item em edição
    
  } else {        
    sNome.value = ''; // Limpa o valor do input de nome
    sFuncao.value = ''; // Limpa o valor do input de função
    sSalario.value = ''; // Limpa o valor do input de salário   
  }  
}

function editItem(index) {
  openModal(true, index); // Abre o modal em modo de edição para o item com o índice fornecido
}

function deleteItem(index) {
  fetch(`${apiUrl}/${index}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then(() => {
      loadItens(); // Chama a função para recarregar os itens após a exclusão
    })
    .catch((error) => {
      console.error(error);
    });
}

function insertItem(item, index) {
  let tr = document.createElement('tr'); // Cria um elemento <tr> para a linha da tabela

  tr.innerHTML = `
    <td>${item.id}</td>
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button> 
    </td>
    <td class="acao">
      <button onclick="deleteItem(${item.id})"><i class='bx bx-trash'></i></button> 
    </td>
  `;
  // Botão de edição que chama a função editItem()
  // Botão de exclusão que chama a função deleteItem()
  tbody.appendChild(tr); // Adiciona a linha criada à tabela
}

btnSalvar.onclick = (e) => {
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return; // Verifica se os campos estão vazios e retorna se algum estiver vazio
  }

  e.preventDefault();

  const formData = {  
    nome: sNome.value,
    funcao: sFuncao.value,
    salario: sSalario.value,
  };  
  if (id !== undefined) {
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        modal.classList.remove('active'); // Fecha o modal
        loadItens(); // Recarrega os itens
        id = undefined; // Limpa o ID do item em edição
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        modal.classList.remove('active'); // Fecha o modal
        loadItens(); // Recarrega os itens
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

function loadItens() {
  tbody.innerHTML = ''; // Limpa o conteúdo da tabela antes de recarregar os itens

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      itens = data; // Armazena os itens retornados da API na variável 'itens'
      data.forEach((item, index) => {
        insertItem(item, index); // Insere cada item na tabela
      });
    })    
    .catch((error) => {
      console.error(error);
    });

    // console.log(itens);
}

document.addEventListener('DOMContentLoaded', () => {
  loadItens(); // Carrega os itens quando o conteúdo da página é carregado
});