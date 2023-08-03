import http from 'k6/http';
import { sleep, check, fail } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
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

export let GetCustomerDuration = new Trend('get_customer_duration');
export let GetCustomerFailRate = new Rate('get_customer_fail_rate');
export let GetCustomerSuccessRate = new Rate('get_customer_success_rate');
export let GetCustomerReqs = new Rate('get_customer_reqs');

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

  GetCustomerDuration.add(res.timings.duration);
  GetCustomerReqs.add(1);
  GetCustomerFailRate.add(res.status > 200 || res.status > 399);
  GetCustomerSuccessRate.add(res.status < 399);

  let durationMSG = 'Max Duration ${1000/1000}s'
  if(!check(res, {
    'max duration': (r) => r.timings.duration < 2000,
    'status should be 201': (r) => r.status === 201,
    'response should have id': (r) => r.json().hasOwnProperty('_id'),
  })){
    fail(durationMSG);
  } 

  const id = res.json()._id;
  globalThis.id = id 
  //console.log(res.body)
  //console.log(id)
  
  sleep(2)
}

//k6 run usuarios/smokeTestUsuers.js