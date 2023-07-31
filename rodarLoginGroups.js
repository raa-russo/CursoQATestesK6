import SmokeTest from "./login/smokeTest.js";
import LoadTest from "./login/loadTest.js";
import StressTest from "./login/stressTest.js";
import StatusCode from "./login/statusCode.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}

export const options = {
    scenarios: {
        login: {
            smokeTest: {
                executor: 'constant-vus',
                exec: 'smokeTest',
                vus: 1,
                duration: '5s',
            },
            loadTest: {
                executor: 'constant-vus',
                exec: 'loadTest',
                vus: 50,
                iterations: 100,
                startTime: '30s',
                maxDuration: '1m',
            },
            stressTest: {
                executor: 'constant-vus',
                exec: 'stressTest',
                vus: 500,
                iterations: 100,
                startTime: '30s',
                maxDuration: '1m',
            },
            statusCode: {
                executor: 'constant-vus',
                exec: 'statusCode',
                vus: 1,
                iterations: 1,
                startTime: '30s',
                maxDuration: '1m',
            },
        },
    }
};


export function smokeTest() {
    group('Endpoint Get smokeTest - APi K6', () => {
        SmokeTest();
    });
};
export function loadTest() {
    group('Endpoint Get loadTest - APi K6', () => {
        LoadTest()
    });
};

export function stressTest() {
    group('Endpoint Get stressTest - APi K6', () => {
        StressTest()
    });
};

export function statusCode() {
    group('Endpoint Get statusCode - APi K6', () => {
        StatusCode()
    });
};