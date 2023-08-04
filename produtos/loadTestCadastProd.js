import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from '../libs/uuid.js';
import Token from "../login/login.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  stages: [
    { duration: "1m", target: 100 },
    { duration: "2m", target: 100 },
    { duration: "1m", target: 0 },

  ],
  thresholds: {
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
    http_req_failed: ['rate<0.01']
  }
}

export default function () {
  const url = 'http://localhost:3000/produtos';
  Token();  
  
  const payload = JSON.stringify ({ 
    nome: `${uuid.v4()}`, 
    preco: 10, 
    descricao: 'teste', 
    quantidade: 5
 })

 const Headers = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${globalThis.token}`,
    'monitor': 'false',
  },
};

const res = http.post(url, payload, Headers);

  check(res, {
    'status should be 201 - created product!': (r) => r.status === 201,
    'response should have id': (r) => r.json().hasOwnProperty('_id'),
  });

  const id = res.json()._id;
  globalThis.id = id 
  //console.log(res.body)
  //console.log(id)  
  sleep(1);  
}

//run test =>  k6 run produtos/loadTestCadastProd.js