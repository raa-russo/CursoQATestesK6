import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  vus: 1,
  duration: '1s',
  thresholds: {
    http_req_duration: ['p(95)<2000'] // 95% das requisições devem responder em até 2s.
  }
}

export default function () {
  // Passo 1: Autenticação e obtenção do token de autorização
  const authUrl = 'http://localhost:3000/login'; // URL de autenticação da Serverest
  const payload = JSON.stringify({ email: 'fulano@qa.com', password: 'teste' }); 
  const headers = { headers: { 'Content-Type': 'application/json' } };
  const authRes = http.post(authUrl, payload, headers);

  check(authRes, {
    'status should be 200': (r) => r.status === 200,
    'response should have token': (r) => r.json().hasOwnProperty('authorization'),
  });

  const token = authRes.json().authorization;

  // Passo 2: Listar produtos para obter o ID de um produto para excluir
  const listarProdutosUrl = 'http://localhost:3000/produtos';
  const listarProdutosHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  };

  const listarProdutosRes = http.get(listarProdutosUrl, listarProdutosHeaders);

  check(listarProdutosRes, {
    'status should be 200': (r) => r.status === 200,
  });

  const produtos = listarProdutosRes.json();
  if (produtos.length === 0) {
    console.log("Nenhum produto encontrado para exclusão.");
    return;
  }

  const produtoId = produtos[0]._id; // Obtém o ID do primeiro produto da lista (altere conforme necessário)

  // Passo 3: Excluir o produto usando o token de autorização
  const excluirProdutoUrl = `http://localhost:3000/produtos/${produtoId}`;
  const excluirProdutoHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  };

  const excluirProdutoRes = http.del(excluirProdutoUrl, null, excluirProdutoHeaders);

  check(excluirProdutoRes, {
    'status should be 200': (r) => r.status === 200,
  });

  console.log(`Produto com ID ${produtoId} excluído com sucesso.`);
  sleep(1);
}
