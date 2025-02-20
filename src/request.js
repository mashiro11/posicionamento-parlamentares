import axios from 'axios'

const request = (where, handleData, handleError) => {
  return axios.get(`https://dadosabertos.camara.leg.br/api/v2/${where}`)
  .then( response => {
    console.log('response:', response)
    if(handleData) handleData(response.data.dados,response.data.links )
  })
  .catch( error => {
    console.log('error:', error)
    if(handleError) handleError(error)
  })
}

export { request }
