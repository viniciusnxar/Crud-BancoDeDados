const express = require('express'); // Importa o módulo Express

const cors = require('cors'); // Importa o módulo CORS

const { createClient } = require('@supabase/supabase-js'); // Importa a função createClient do módulo @supabase/supabase-js

const supabaseUrl = ''; // URL do Supabase (deve ser preenchida com a URL do seu projeto no Supabase)
const supabaseKey = ''; // Chave do Supabase (deve ser preenchida com a chave do seu projeto no Supabase)

const supabase = createClient(supabaseUrl, supabaseKey); // Cria um cliente do Supabase usando a URL e a chave fornecidas

const app = express(); // Cria uma instância do Express

app.use(express.json()); // Adiciona o middleware para tratar os dados recebidos em JSON

app.use(cors()); // Adiciona o middleware do CORS para permitir requisições de outros domínios

const port = 3000; // Porta em que o servidor irá rodar

app.get('/itens', async (req, res) => {
  try {
    const { data, error } = await supabase.from('funcionarios').select('*') .order('id', { ascending: true });
    // Realiza uma consulta no Supabase para obter os dados da tabela 'funcionarios', ordenados pelo campo 'id' em ordem crescente
    // A resposta é armazenada nas variáveis 'data' e 'error'

    if (error) throw error; // Se ocorrer um erro na consulta, lança uma exceção

    res.json(data); // Retorna os dados em formato JSON como resposta

  } catch (error) {
    console.error(error); // Exibe o erro no console
    res.status(500).json({ error: 'Erro ao buscar itens.' }); // Retorna uma resposta de erro com status 500 (Internal Server Error)
  }
});

app.post('/itens', async (req, res) => {
  try {
    const { nome, funcao, salario } = req.body;
    const { data, error } = await supabase
      .from('funcionarios')
      .insert([{ nome, funcao, salario }]);
    // Insere um novo item na tabela 'funcionarios' do Supabase com os valores fornecidos em 'nome', 'funcao' e 'salario'

    if (error) throw error; // Se ocorrer um erro na inserção, lança uma exceção

    res.status(201).json(data); // Retorna os dados do item criado com status 201 (Created)

  } catch (error) {
    console.error(error); // Exibe o erro no console
    res.status(500).json({ error: 'Erro ao criar item.' }); // Retorna uma resposta de erro com status 500 (Internal Server Error)
  }
});

app.put('/itens/:id', async (req, res) => {
  try {    
    const { id } = req.params;        
    const { nome, funcao, salario } = req.body;
    const { data, error } = await supabase
      .from('funcionarios')
      .update({ nome, funcao, salario })
      .eq('id', id);
    // Atualiza o item da tabela 'funcionarios' do Supabase com o ID correspondente ao fornecido em 'id' e os novos valores em 'nome', 'funcao' e 'salario'

    if (error) throw error; // Se ocorrer um erro na atualização, lança uma exceção

    res.json(data); // Retorna os dados atualizados como resposta

  } catch (error) {
    console.error(error); // Exibe o erro no console
    res.status(500).json({ error: 'Erro ao atualizar item.' }); // Retorna uma resposta de erro com status 500 (Internal Server Error)
  }
});

app.delete('/itens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID = ' + id);
    const { data, error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id);
    // Exclui o item da tabela 'funcionarios' do Supabase com o ID correspondente ao fornecido em 'id'

    if (error) throw error; // Se ocorrer um erro na exclusão, lança uma exceção

    res.json(data); // Retorna os dados do item excluído como resposta

  } catch (error) {
    console.error(error); // Exibe o erro no console
    res.status(500).json({ error: 'Erro ao excluir item.' }); // Retorna uma resposta de erro com status 500 (Internal Server Error)
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`); // Exibe uma mensagem informando que o servidor está rodando na porta especificada
});
