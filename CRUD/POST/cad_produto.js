import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from '../libs/uuid.js'

export const options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<2000'] //95% das requisiçoes devem responder em ate 2s.
  }
}

export default function () {
    const url = 'http://localhost:3000/login';

    const payload = JSON.stringify ({ email: 'fulano@qa.com', password: 'teste' })
    const headers = { 'headers': { 'Content-Type': 'application/json' } }
    const res = http.post(url, payload, headers)
    

    check(res, {
        'status shoul be 200': (r) => r.status === 200,    
        'response should have token': (r) => r.json().hasOwnProperty('authorization'),
  });  

  const token = res.json().authorization.slice(7);

  // Passo 2: Cadastrar um produto usando o token de autorização
  const produtoUrl = 'http://localhost:3000/produtos';

  const produtoPayload = JSON.stringify({
    nome: `${uuid.v4()}`, 
    preco: 10, 
    descricao: 'teste', 
    quantidade: 5
  });
  
  const produtoHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Adicionando o token no header de autorização
    },
  };

  const produtoRes = http.post(produtoUrl, produtoPayload, produtoHeaders);

  check(produtoRes, {
    'status should be 201 - created product!': (r) => r.status === 201,
  });
  
  sleep(1);
}
