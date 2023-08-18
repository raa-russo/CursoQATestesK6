import http from 'k6/http';
import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { BaseRest, BaseChecks, ENDPOINTS, testConfig } from '../../support/base/baseTest.js';
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";
import { writeFileSync } from 'https://fs';
const fs = require('fs');


export const options = testConfig.options.smokeThresholds;

const base_uri = testConfig.environment.html.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

const data = new SharedArray('Users', function () {
  const jsonData = JSON.parse(open('./data/dynamic/newUser.json'));
  return jsonData;
});

function criarUsuario() {
  const payload = [];

  for (let i = 1; i < 2; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const pass = faker.internet.password();
    const adm = true;

    payload.push({
      email: email,
      password: pass,
    });
  }

  try {
    writeFileSync('./data/dynamic/newUser.json', JSON.stringify(payload));
    // ficheiro escrito com sucesso
  } catch (err) {
    console.error(err);
  }
  console.log(payload);
};
  criarUsuario();

    export function setup() {
      const res = baseRest.post(ENDPOINTS.USER_ENDPOINT, payload)

      baseChecks.checkStatusCode(res, 201);

      console.log('Cadastro realizado com sucesso! ')
      return { responseData: res.json() }
    }
    console.log(payload);
    export default () => {
      let userIndex = __ITER % data.length;
      let user = data[userIndex];

      const urlRes = baseRest.post(ENDPOINTS.LOGIN_ENDPOINT, user);

      baseChecks.checkStatusCode(urlRes, 200);

      console.log('Realizando Login')
      sleep(1);
    };

    export function teardown(responseData) {
      const userId = responseData.responseData._id;
      const res = http.del(`http://localhost:3000/usuarios/${userId}`);
      //const res = baseRest.delete(ENDPOINTS.USER_ENDPOINT + `/${userId}`);

      baseChecks.checkStatusCode(res, 200);

      console.log(`Teardown deletando o usuario com o ID ${userId}`)

    }

//k6 run data/dynamic/fakerSmokeTest.js