import http from "k6/http";
import { sleep, check, fail } from "k6";
import { Trend, Rate, Counter } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  stages: [
    { duration: "2s", target: 100 },
    { duration: "3s", target: 100 },
    { duration: "2s", target: 200 },
    { duration: "3s", target: 200 },
    { duration: "1s", target: 300 },
    { duration: "2s", target: 300 },
    { duration: "3s", target: 400 },
    { duration: "1s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<5000"],
    http_req_failed: ['rate<0.05']
  },
};

export let GetCustomerDuration = new Trend('get_customer_duration');
export let GetCustomerFailRate = new Rate('get_customer_fail_rate');
export let GetCustomerSuccessRate = new Rate('get_customer_success_rate');
export let GetCustomerReqs = new Rate('get_customer_reqs');

export default function () {
  const url = 'http://localhost:3000/login';

  const payload = JSON.stringify({
    email: 'fulano@qa.com',
    password: 'teste'
  })
  const headers = { 
    'headers': { 
      'Content-Type': 'application/json',
      'monitor': 'false'
     } }

  const res = http.post(url, payload, headers);

  GetCustomerDuration.add(res.timings.duration);
  GetCustomerReqs.add(1);
  GetCustomerFailRate.add(res.status > 200 || res.status > 399);
  GetCustomerSuccessRate.add(res.status < 399);

  let durationMSG = 'Max Duration ${1000/1000}s'
  if (!check(res, {
    'max duration': (r) => r.timings.duration < 2000,
    'is status code 200': (r) => r.status === 200,
  })) {
    fail(durationMSG);
  }
  sleep(1);
}

//run test => k6 run login/stressTest.js