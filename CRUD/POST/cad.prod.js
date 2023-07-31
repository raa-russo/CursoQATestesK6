import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
    const url = 'http://localhost:3000/login';

    const payload = JSON.stringify ({ email: 'fulano@qa.com', password: 'teste' })
    const headers = { 'headers': { 'Content-Type': 'application/json' } }
    const res = http.post(url, payload, headers)

    console.log("response:", JSON.parse(res.body).Authorization)

    check(res, {
        'status shoul be 200': (r) => r.status === 200,    
        'response should have token': (r) => r.json().hasOwnProperty('authorization'),
  });

  console.log(res.body)
  sleep(1)

  const token = res.json().authorization.slice(7);
  console.log(token)

  // Passo 2: Cadastrar um produto usando o token de autorização
  const produtoUrl = 'http://localhost:3000/produtos';
  const produtoPayload = JSON.stringify({
    nome: `Produto Teste`,
    preco: 100.0,
    descricao: 'Descrição do produto',
    quantidade: 5,
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
  sleep(1);
}
