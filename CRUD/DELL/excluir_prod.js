import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  vus: 10,
  //duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições devem responder em até 2s.
  },
};

export default function () {
  // Passo 1: Autenticação e obtenção do token de autorização
  const authUrl = 'http://localhost:3000/login'; 
  const payload = JSON.stringify({ email: 'fulano@qa.com', password: 'teste' }); 
  const headers = { headers: { 'Content-Type': 'application/json' } };
  const authRes = http.post(authUrl, payload, headers);

  check(authRes, {
    'status should be 200': (r) => r.status === 200,
    'response should have token': (r) => r.json().hasOwnProperty('authorization'),
  });

  const token = authRes.json().authorization;

  // Passo 2: Cadastrar um produto usando o token de autorização
  const produtoUrl = 'http://localhost:3000/produtos';
  const produtoPayload = JSON.stringify({
    nome: `Produto Teste`,
    preco: 100.0,
    descricao: 'Descrição do produto',
  });
  const produtoHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Adicionando o token no header de autorização
    },
  };

  const produtoRes = http.post(produtoUrl, produtoPayload, produtoHeaders);

  check(produtoRes, {
    'status should be 201': (r) => r.status === 201,
  });

  console.log(produtoRes.body);

  // Passo 3: Excluir o produto usando o token de autorização
  const produtoId = produtoRes.json()._id; // Obtém o ID do produto criado

  const excluirProdutoUrl = `http://localhost:3000/produtos/${produtoId}`;
  const excluirProdutoHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const excluirProdutoRes = http.del(excluirProdutoUrl, null, excluirProdutoHeaders);

  check(excluirProdutoRes, {
    'status should be 200': (r) => r.status === 200,
  });

  console.log(`Produto com ID ${produtoId} excluído com sucesso.`);
  sleep(1);
}
