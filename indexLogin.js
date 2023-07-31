import SmokeTest from "./Login/smokeTest.js";
import LoadTest from "./Login/loadTest.js";
import StressTest from "./Loginnin/stressTest.js";
import StatusCode from "./Loginnin/statusCode.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  ROTAS: {
    Login: {
      SmokeTest: {
        executor: 'constant-vus',
        exec: 'contacts',
        vus: 1,
        duration: '5s',
      },
      LoadTest: {
        executor: 'constant-vus',
        exec: 'contacts',
        vus: 50,
        iterations: 100,
        startTime: '30s',
        maxDuration: '1m',
      },
      StressTest: {
        executor: 'constant-vus',
        exec: 'contacts',
        vus: 500,
        iterations: 100,
        startTime: '30s',
        maxDuration: '1m',
      },
      StatusCode: {
        executor: 'constant-vus',
        exec: 'contacts',
        vus: 1,
        iterations: 1,
        startTime: '30s',
        maxDuration: '1m',
      },
    },
  },
}

export function SmokeTest() {
  group('Smoke test running - APi K6', () => {
  });
}
export function LoadTest() {
  group('Load test runnings - APi K6', () => {
  });
}  

export function StressTest() {
  group('Stress test runnings - APi K6', () => {
  });
} 

export function StatusCode() {
  group('Status code test runnings - APi K6', () => {
  });
} 