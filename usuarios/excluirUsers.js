import http from 'k6/http';
import { sleep, check } from 'k6';
import IDUsers from "./cadastrarUsers.js";

export default function () {
IDUsers();
const url = `http://localhost:3000/usuarios/${globalThis.id}`;


const headers = { 'headers': { 
  'Content-Type': 'application/json',
  'monitor': 'false',
 } }
  
const res = http.del(url, headers)

  check(res, {
    'status shoul be 200': (r) => r.status === 200,      
  });
  
  //console.log(res.body)
  sleep(1)
}

//k6 run usuarios/excluirUsers.js