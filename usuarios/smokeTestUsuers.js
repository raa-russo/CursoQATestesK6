import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from '../libs/uuid.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
export const options = {
  stages: [
    { duration: "1s", target: 1 },
   
  ],
  thresholds: {
    http_req_duration: ["p(95)<3000"],
    http_req_failed: ['rate<0.05']
  },
};

export default function () {
  const url = 'http://localhost:3000/usuarios';

const payload = JSON.stringify ({ 
  nome: `${uuid.v4()}`, 
  email: `${uuid.v4().substring(24)}@qa.com`, 
  password: 'teste', 
  administrador: 'true' 
})

const headers = { 'headers': {
   'Content-Type': 'application/json',
   'monitor': 'false',
   } }
  
const res = http.post(url, payload, headers)

  check(res, {
    'status shoul be 201': (r) => r.status === 201,
    'response should have id': (r) => r.json().hasOwnProperty('_id'),   
  });

  const id = res.json()._id;
  globalThis.id = id 
  //console.log(res.body)
  //console.log(id)
  
  sleep(2)
}

//k6 run usuarios/smokeTestUsuers.js