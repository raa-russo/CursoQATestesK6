import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { check, fail } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }

  export const options = {
    stages: [
      { duration: '10s', target: 50 },
      { duration: '2s', target: 100 },
      { duration: '5s', target: 200 },
      { duration: '10s', target: 100 },
      { duration: '5s', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(95)<2000'], //95% das requisiçoes devem responder em ate 2s.
      http_req_failed: ['rate<0.01'] //1% das reuisicoes podem ocorrer erro.
    }  
  }

export let GetCustomerDuration = new Trend('get_customer_duration');
export let GetCustomerFailRate = new Rate('get_customer_fail_rate');
export let GetCustomerSuccessRate = new Rate('get_customer_success_rate');
export let GetCustomerReqs = new Rate('get_customer_reqs');

export default function () {
  let res = http.get('http://localhost:3000/carrinhos')

  GetCustomerDuration.add(res.timings.duration);
  GetCustomerReqs.add(1);
  GetCustomerFailRate.add(res.status == 0 || res.status > 399);
  GetCustomerSuccessRate.add(res.status < 399);

  let durationMSG = 'Max Duration ${1000/1000}s'
  if(!check(res, {
    'max duration': (r) => r.timings.duration < 1000,
    'is status code 200': (r) => r.status === 200,
  })){
    fail(durationMSG);
  }
  sleep(1);
}

