import SmokeTest from "./Login/smokeTest.js";
import LoadTest from "./Login/loadTest.js";
import StressTest from "./Login/stressTest.js";
import StatusCode from "./Login/statusCode.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}

export const options = {
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
}


export function Smoke() {
    group('Smoke test running - APi K6', () => {
        SmokeTest();
    });
}
export function Load() {
    group('Load test runnings - APi K6', () => {
        LoadTest()
    });
}

export function Stress() {
    group('Stress test runnings - APi K6', () => {
        StressTest()
    });
}

export function Status() {
    group('Status code test runnings - APi K6', () => {
        StatusCode()
    });
} 