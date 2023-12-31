import http from 'k6/http';
import { sleep } from 'k6';
import { check, fail } from 'k6';
import ID_Prod from "./cadastrar.js";
import Token from "../login/login.js";

export default function () {
  ID_Prod();
  const url = `http://localhost:3000/produtos/${globalThis.id}`;      
    Token();   

  const Headers = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${globalThis.token}`, 
      'monitor': 'false',
    },
  };  
  
  const res = http.del(url,null, Headers);  

  check(res, {    
    'is status code 200 - Registro excluído com sucesso': (r) => r.status === 200,     
  });

  //console.log(res.body);
  //console.log(id)
  sleep(1);
}

//run test =>  k6 run produtos/excluir.js