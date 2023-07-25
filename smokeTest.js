const axios = require('axios');

const baseUrl = 'http://localhost:3000'; // URL base da Serverest

async function performSmokeTest() {
  try {
    // Realiza uma requisição GET para a rota /usuarios da API Serverest
    const response = await axios.get(`${baseUrl}/usuarios`);

    // Verifica se a resposta foi bem-sucedida (status 2xx)
    if (response.status >= 200 && response.status < 300) {
      console.log('Smoke Test passed! API is up and running.');
    } else {
      console.error('Smoke Test failed! API returned an error.');
    }
  } catch (error) {
    console.error('Smoke Test failed! Unable to connect to the API.');
    console.error(error.message);
  }
}

performSmokeTest();
