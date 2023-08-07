import http from 'k6/http';
import { sleep, check } from 'k6';
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export default function () {
  const url = 'http://localhost:3000/usuarios';

  faker.locale = 'pt_BR'; 
  const users = [];

  const name = faker.name.findName();
  const email = faker.internet.email(name);
  const pass = faker.internet.password();

const payload = JSON.stringify ({ 
  nome: name, 
  email: email, 
  password: pass, 
  administrador: 'true' 
})

 users.push(payload);

const headers = { 'headers': {
   'Content-Type': 'application/json',
   'monitor': 'false',
   } }
  
const res = http.post(url, payload, headers)

  check(res, {
    'status shoul be 201': (r) => r.status === 201,
    'response should have id': (r) => r.json().hasOwnProperty('_id'),   
  });

  const id = res.json()._id;
  globalThis.id = id ;
//   console.log(res.body);
//   console.log(id);
//   console.log(users);
//   const emaill = res.json.email;
//   console.log(emaill);
   
  sleep(2);
}


//k6 run usuarios/cadastrarUsers.js