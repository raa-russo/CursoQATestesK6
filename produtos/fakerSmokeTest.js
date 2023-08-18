import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { BaseChecks, BaseRest, ENDPOINTS, testConfig } from '../../support/base/baseTest.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = testConfig.options.smokeThresholds;

const baseRest = new BaseRest(testConfig.environment.html.url);
const baseChecks = new BaseChecks();

const dataUsers = new SharedArray('users', function () {
    const jsonData = JSON.parse(open('../../data/dynamic/newUser.json'));
    return jsonData;
});

const dataProducts = new SharedArray('products', function () {
    const jsonData = JSON.parse(open('../../data/dynamic/newProd.json'));
    return jsonData;
});

export function setup() {
    let authorizationTokens = [];
    let productsTokens = [];

    for (let i = 0; i < dataUsers.length; i++) {
        baseRest.post(ENDPOINTS.USER_ENDPOINT, dataUsers[i])
        sleep(0.1)
        let res = baseRest.post(ENDPOINTS.LOGIN_ENDPOINT, { email: `${dataUsers[i].email}`, password: `${dataUsers[i].password}` })
        authorizationTokens.push(res.json().authorization)
    }

    for (let i = 0; i < dataProducts.length; i++) {
        sleep(0.1)
        let res = baseRest.post(ENDPOINTS.PRODUCTS_ENDPOINT, dataProducts[i], { authorization: authorizationTokens[0]})
        productsTokens.push(res.json()._id)
    }

    let database = {
        'authorizations': authorizationTokens,
        'productsId': productsTokens
    }

    return database;
}

export default function (database) {    

    let payload = {
        "produtos": [
            {
                "idProduto": database.productsId[__VU-1],
                "quantidade": 1
            }
        ]
    }
    
    let res = baseRest.post(ENDPOINTS.CARTS_ENDPOINT, payload, { authorization: database.authorizations[__VU-1]})
       
}

//k6 run tests/carrinhos/fakerSmokeTest.js