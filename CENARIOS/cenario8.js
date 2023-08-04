import SmokeTest from "../login/smokeTest.js";
import LoadTest from "../usuarios/loadTestUsers.js";
import StressTest from "../produtos/stressTestCadastProd.js";
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
                duration: '5s',
            },
            loadTest: {
                executor: 'per-vu-iterations',
                exec: 'loadTest',
                vus: 50,
                iterations: 100,
                startTime: '5s',
                maxDuration: '1m',
            },
            stressTest: {
                executor: 'per-vu-iterations',
                exec: 'stressTest',
                vus: 500,
                iterations: 50,
                startTime: '10s',
                maxDuration: '3m',
            },
            
        },
    
};


export function smokeTest() {
    group('Endpoint Get smokeTest de login - APi K6', () => {
        SmokeTest();
    });
};
export function loadTest() {
    group('Endpoint Get loadTest de criar users - APi K6', () => {
        LoadTest()
    });
};

export function stressTest() {
    group('Endpoint Get stressTest de criar products- APi K6', () => {
        StressTest()
    });
};


//run test => k6 run cenarios/cenario8.js 