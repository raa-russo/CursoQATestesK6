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
        smokeTest: {
            executor: 'constant-vus',
            exec: 'contacts',
            vus: 1,
            duration: '5s',
        },
        loadTest: {
            executor: 'constant-vus',
            exec: 'contacts',
            vus: 50,
            iterations: 100,
            startTime: '30s',
            maxDuration: '1m',
        },
        stressTest: {
            executor: 'constant-vus',
            exec: 'contacts',
            vus: 500,
            iterations: 100,
            startTime: '30s',
            maxDuration: '1m',
        },
        statusCode: {
            executor: 'constant-vus',
            exec: 'contacts',
            vus: 1,
            iterations: 1,
            startTime: '30s',
            maxDuration: '1m',
        },
    },
}


export function smokeTest() {
    group('Smoke test running - APi K6', () => {
        SmokeTest();
    });
}
export function loadTest() {
    group('Load test runnings - APi K6', () => {
        LoadTest()
    });
}

export function stressTest() {
    group('Stress test runnings - APi K6', () => {
        StressTest()
    });
}

export function statusCode() {
    group('Status code test runnings - APi K6', () => {
        StatusCode()
    });
} 