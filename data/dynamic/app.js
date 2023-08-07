import http from 'k6/http';
import { sleep, check } from 'k6';
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";

export default function () {
  const url = 'http://localhost:3000/usuarios';

  faker.locale = 'pt_BR';
 // const users = [];

  const randomName = faker.name.fistName();
  const randomEmail = faker.internet.email();
  const randomPass = faker.internet.password();

const payload = JSON.stringify ({ 
  nome: randomName, 
  email: randomEmail, 
  password: randomPass, 
  administrador: 'true' 
})

    //users.push(payload);

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
  globalThis.id = id 
  console.log(res.body)
  console.log(id)
  
  
  sleep(2);
}


//k6 run usuarios/cadastrarUsers.js