import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }  

export const options = {
  thresholds: {
    // 90% das requisicoes finalizadas com 400ms, 95% com 800, and 99.9% com 2s.
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
  },
};

export default function () {
  const res1 = http.get('http://localhost:3000');
  sleep(1);
}
check(res, {
  "Status é 200": (r) => r.status === 200,
  'body size is 3237 bytes': (r) => r.body.length == 3237,
});



