import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import uuid from '../libs/uuid.js';
import Token from "./login_token.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

// export const options = {
//   vus: 10,
//   duration: '30s',
//   thresholds: {
//     http_req_duration: ['p(95)<2000'] //95% das requisiçoes devem responder em ate 2s.
//   }
// }

export default function () {
  const url = 'http://localhost:3000/produtos';

  group('Endpoint Post Customer - controler customer - Serverest.Api', () => {
    Token();
  });
  
  const payload = JSON.stringify ({ 
    nome: `${uuid.v4()}`, 
    preco: 10, 
    descricao: 'teste', 
    quantidade: 5
 })

 const Headers = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${globalThis.token}`, // Adicionando o token no header de autorização
  },
};

const produtoRes = http.post(url, payload, Headers);

  check(produtoRes, {
    'status should be 201 - created product!': (r) => r.status === 201,
  });

  console.log(produtoRes.body);
  sleep(1);
  
}

