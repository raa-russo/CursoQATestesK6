import { sleep } from 'k6';
import Token from "../login/log.js";
import ID_Prod from "../products/cadastrar.js";
import uuid from '../../data/dynamic/uuid.js';
import { BaseRest, BaseChecks, ENDPOINTS, testConfig } from '../../support/base/baseTest.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = testConfig.options.smokeThresholds;

const base_uri = testConfig.environment.html.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

const payload = {
  nome: `${uuid.v4()}`,
  email: `${uuid.v4().substring(24)}@qa.com`,
  password: 'teste',
  administrador: 'true'
}
const mail = payload.email;
globalThis.email = mail;

export function setup() {
  const res = baseRest.post(ENDPOINTS.USER_ENDPOINT, payload)
  baseChecks.checkStatusCode(res, 201);

  console.log('Cadastro realizado com sucesso! ')

  const user = JSON.stringify({
    email: globalThis.email,
    password: 'teste'
  })
  const urlRes = baseRest.post(ENDPOINTS.LOGIN_ENDPOINT, user);

  baseChecks.checkStatusCode(urlRes, 200); 

  console.log('Realizando Login')

  const token = urlRes.json().authorization;
  //console.log(token);
  globalThis.token = token;

  sleep(1);
};
export default function () {
  Token();

  const payload = JSON.stringify({
    nome: `${uuid.v4()}`,
    preco: 10,
    descricao: 'teste',
    quantidade: 5
  })

  const res = baseRest.post(ENDPOINTS.PRODUCTS_ENDPOINT, payload + { 'Authorization': `${globalThis.token}` });

  baseChecks.checkStatusCode(res, 201);
  baseChecks.checkResponseTime(res, 1000)
  baseChecks.checkResponseBody(res, "Cadastro realizado com sucesso")
  baseChecks.checkBodySide(res, 2000)

  console.log('Produto cadastrado com sucesso! ')
  const idProd = res.json()._id;
  globalThis.id = idProd;
  //console.log(idProd);

  sleep(2);

}
export function teardown() {
  ID_Prod();
  
  const res = baseRest.del(ENDPOINTS.PRODUCTS_ENDPOINT + `${globalThis.prodId}`, { headers: { Authorization: globalThis.token } });

  baseChecks.checkStatusCode(res, 200);

  console.log(`Teardown deletando o produto com o ID ${globalThis.prodId}`);
}


//k6 run tests/post/smokeLoginTest.js