import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { BaseChecks, BaseRest, ENDPOINTS, testConfig } from '../../../support/base/baseTest.js';

// Config test

export const options = testConfig.options.loadThresholds;
const baseRest = new BaseRest(testConfig.environment.html.url);
const baseCheck = new BaseChecks();

const data = new SharedArray('postProducts', function () {
    const jsonData = JSON.parse(open('C:/workspace-compass/aws-performance/projeto-base-k6/data/dynamic/products.json'));
    return jsonData;
});

// Setup code

export function setup() {
    const createUser = {
        "nome": "administrador",
        "email": "admin@teste.com.br",
        "password": "senha",
        "administrador": "true"
    };
    let res = baseRest.post(ENDPOINTS.USER_ENDPOINT, createUser);
    res = baseRest.post(ENDPOINTS.LOGIN_ENDPOINT, { email: `${createUser.email}`, password: `${createUser.password}` });

    let authorizationToken = res.json().authorization;
    let productsIds = [];

    for (let i = 0; i < data.length; i++) {
        res = baseRest.post(ENDPOINTS.PRODUCT_ENDPOINT, data[i], { authorization: authorizationToken })
        productsIds.push(res.json()._id)
        sleep(0.1)
    }
    const database = {
        'authorizationToken': authorizationToken,
        'productsIds': productsIds
    }
    return database;
};

export default function (database) {
    let userIndex = __ITER % data.length;

    let payload = {
        nome: `${data[__VU].nome} ${userIndex} Alterado`,
        preco: `${data[__VU].preco}`,
        descricao: `${data[__VU].descricao}`,
        quantidade: 1000
    }

    let res = baseRest.put(ENDPOINTS.PRODUCT_ENDPOINT, database.productsIds[__VU], payload, { authorization: database.authorizationToken })

    baseCheck.checkStatusCode(res)
    baseCheck.checkResponseTime(res, 300)
    baseCheck.checkResponseBody(res, "Registro alterado com sucesso")
    baseCheck.checkBodySide(res, 2000)
    sleep(1);
};

export function teardown(database) {

    for (let i = 0; i < database.productsIds.length; i++) {
        baseRest.del(ENDPOINTS.PRODUCT_ENDPOINT, database.productsIds[i], { authorization: database.authorizationToken });
    }

    let response = baseRest.get(ENDPOINTS.USER_ENDPOINT)
    let data = Object.assign(response.json().usuarios);
    for (let i = 0; i < data.length; i++) {
        baseRest.del(ENDPOINTS.USER_ENDPOINT, data[i]._id);
    }
}
