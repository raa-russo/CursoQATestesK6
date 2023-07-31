import http from "k6/http";
import { check, sleep, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

const baseUrl = "http://localhost:3000/login"; 

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
  group("loadTest", function () {
    const endpoint = "/usuarios/";
    
    const response = http.get(`${baseUrl}${endpoint}`);
    try {        
      if (response.status >= 200 && response.status < 300) {
        console.error('Load Test passou! API connect.');
      } else {
        console.error('Load Test falhou! API returned an error.');
      }
    } catch (error) {
      console.error('Load Test falhou! Unable to connect to the API.');
      console.error(error.message);
    }    
    check(response, {
      "Status é 200": (r) => r.status === 200,
    });

    sleep(1);
  });
}
