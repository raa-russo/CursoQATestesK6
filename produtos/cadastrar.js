import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from '../libs/uuid.js';
import Token from "../login/login.js";

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

