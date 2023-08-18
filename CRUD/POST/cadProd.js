import http from 'k6/http';
import { sleep } from 'k6';
import uuid from '../../data/dynamic/uuid.js';
import Token from "../login/log.js";

export default function () {
  const url = 'http://localhost:3000/produtos';
  Token();

  const payload = JSON.stringify({
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

  console.log('Produto cadastrado com sucesso! ')
  const idProd = res.json()._id;
  globalThis.prodId = idProd;

  sleep(1);
}

//k6 run tests/post/cadProd.js