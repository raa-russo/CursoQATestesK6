import SmokeTest from "./smokeTest.js";
import LoadTest from "./loadTest.js";
import StressTest from "./stressTest.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }

  export const options = {
    stages: [
      { duration: '30s', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '30s', target: 200 },
      { duration: '1m', target: 100 },
      { duration: '3m', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'], 
      http_req_failed: ['rate<0.01'] 
    }
  }

export default () => {
    group('Endpoint smoke teste - Serverest.Api', () => {
      SmokeTest();
    });

    group('Endpoint load teste - Serverest.Api', () => {
      LoadTest();
    });

    group('Endpoint teste de stress - Serverest.Api', () => {
      StressTest();
    });   

    sleep(1);
}