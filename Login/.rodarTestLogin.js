import Login from "./login.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }

  export const options = {
    stages: [
      { duration: '10s', target: 50 },
      { duration: '20s', target: 100 },
      { duration: '30s', target: 200 },
      { duration: '10s', target: 100 },
      { duration: '30s', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(90) < 2000'], 
      http_req_failed: ['rate<0.01'] 
    }
  }

export default () => {
    group('Endpoint Login de usuários - Serverest.Api', () => {
      Login();
    });    

    sleep(1);
}
//run test => k6 run login/.rodarTestLogin.js