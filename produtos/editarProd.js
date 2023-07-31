import http from 'k6/http';
import { sleep, check } from 'k6';
import Token from "../login/login.js";
import ID_Prod from "./cadastrarProd.js";

export default function () {
  ID_Prod();
  const url = `http://localhost:3000/produtos/${globalThis.id}`;
  Token();    
  
  const payload = JSON.stringify ({ 
    "nome": "Logitech MX Vertical",
    "preco": 470,
    "descricao": "Mouse",
    "quantidade": 381
 })

 const Headers = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${globalThis.token}`, 
    'monitor': 'false',
  },
};

const res = http.put(url, payload, Headers);

  check(res, {
    'status should be 200 - Registro alterado com sucesso': (r) => r.status === 200,
    'response should have id': (r) => r.json().hasOwnProperty('_id'),
  });

  const id = res.json()._id;
  globalThis.id = id 
  //console.log(res.body)
  //console.log(id)  
  sleep(1);  
}

