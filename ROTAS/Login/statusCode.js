import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { check, fail } from 'k6';

export let GetCustomerDuration = new Trend('get_customer_duration');
export let GetCustomerFailRate = new Rate('get_customer_fail_rate');
export let GetCustomerSuccessRate = new Rate('get_customer_success_rate');
export let GetCustomerReqs = new Rate('get_customer_reqs');

export const options = {
    thresholds: {
        // 90% das requisicoes finalizadas com 400ms, 95% com 800, and 99.9% com 2s.
        http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
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

    GetCustomerDuration.add(res.timings.duration);
    GetCustomerReqs.add(1);
    GetCustomerFailRate.add(res.status == 0 || res.status > 399);
    GetCustomerSuccessRate.add(res.status < 399);

    let durationMSG = 'Max Duration ${1000/1000}s'
    if (!check(res, {
        'max duration': (r) => r.timings.duration < 5000,
    })) {
        fail(durationMSG);
    }

    check(res, {
        'status shoul be 200': (r) => r.status === 200,
        'response should have token': (r) => r.json().hasOwnProperty('authorization'),
        'body size is 265 bytes': (r) => r.body.length == 265,
    });   

    //console.log(res.body.length)
    //console.log(res.body)
    sleep(1);
}




