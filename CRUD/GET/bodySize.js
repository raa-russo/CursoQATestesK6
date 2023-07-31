import { check } from 'k6';
import http from 'k6/http';
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
      http_req_failed: ['rate<0.01'] //1% das requisicoes podem ocorrer erro.
    }  
  }

export default function () {
  const res = http.get('http://localhost:3000');
  check(res, {
    'body size is 3237 bytes': (r) => r.body.length == 3237,
    'is status 200': (r) => r.status === 200,
  });
  //console.log(res.body.length);
}
