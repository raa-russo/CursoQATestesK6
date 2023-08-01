import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
export const options = {
  stages: [
    { duration: "1m", target: 100 },
    { duration: "2m", target: 100 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ['rate<0.01']
  },
};

export default function () {
  const url = 'http://localhost:3000/login';

  const payload = JSON.stringify({
    email: 'fulano@qa.com',
    password: 'teste'
  })
  const headers = { 'headers': { 'Content-Type': 'application/json' } }
  const res = http.post(url, payload, headers)

  try {
    if (res.status >= 200 && res.status < 300) {
     // console.error('Load Test passou! API connect.');
    } else {
     // console.error('Load Test falhou! API returned an error.');
    }
  } catch (error) {
    //console.error('Load Test falhou! Unable to connect to the API.');
    //console.error(error.message);
  }
  check(res, {
    "Status é 200": (r) => r.status === 200,
  });
  //console.log(res.body);
  sleep(1);
}

//run test => k6 run login/loadTest.js




