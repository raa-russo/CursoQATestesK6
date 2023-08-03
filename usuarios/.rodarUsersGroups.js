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
    scenarios: {
        smokeTest: {
            executor: 'constant-vus',
            exec: 'smokeTest',
            vus: 1,
            duration: '1s',
        },
        loadTest: {
            executor: 'per-vu-iterations',
            exec: 'loadTest',
            vus: 50,
            iterations: 100,
            startTime: '30s',
            maxDuration: '1m',
        },
        stressTest: {
            executor: 'per-vu-iterations',
            exec: 'stressTest',
            vus: 500,
            iterations: 100,
            startTime: '50s',
            maxDuration: '1m',
        }       
    },
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

//run test => k6 run usuarios/.rodarUsersGroups.js