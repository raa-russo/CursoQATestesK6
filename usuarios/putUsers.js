import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { BaseChecks, BaseRest, ENDPOINTS, testConfig } from '../../../support/base/baseTest.js';

const testName = 'smokeTestUpdateUser'
export const options = testConfig.options.smokeThresholds;
const baseRest = new BaseRest(testConfig.environment.html.url);
const baseCheck = new BaseChecks();

export function handleSummary(data) {
  return {
    [`${testName}.html`]: htmlReport(data),
  };
}

const data = new SharedArray('putUser', function () {
  const jsonData = JSON.parse(open('../../../data/dynamic/users.json'));
  return jsonData;
});

export function setup() {
  let userIds = [];

  for (let i = 0; i < data.length; i++) {
    const res = baseRest.post(ENDPOINTS.USER_ENDPOINT, data[i])
    userIds.push(res.json()._id)
    sleep(0.1)
  }
  return userIds;
}

export default function (userIds) {
  let userIndex = __ITER % data.length;

  let payload = {
    nome: `${data[__VU].nome} Alterado`,
    email: `${data[__VU].nome}${userIndex}@teste_alterado.com.br`,
    password: "senha",
    administrador: data[__VU].administrador
  }

  let res = baseRest.put(ENDPOINTS.USER_ENDPOINT, userIds[__VU], payload)

  baseCheck.checkStatusCode(res)
  baseCheck.checkResponseTime(res, 300)
  baseCheck.checkResponseBody(res, "Registro alterado com sucesso")
  baseCheck.checkBodySide(res, 2000)
  sleep(1);
}

export function teardown(userIds) {
  for (let i = 0; i < data.length; i++) {
    baseRest.del(ENDPOINTS.USER_ENDPOINT, userIds[i]);
    sleep(0.1)
  }
}
