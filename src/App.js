import React from 'react'
import './App.css';
import Home from './Home'
import { request } from './request.js'
import posicionamento from './posicionamento.json'

const App = (props) => {
  const [ state, setState ] = React.useState({deputados: [], error: null, partidos: [], partidoPage: 1})
  const addPosicao = (deputado) => {
    let pos = posicionamento.find( pos => pos.nomeParlamentar === deputado.nome)
    if(pos){
      deputado.posicao = pos.posicao
      deputado.tel = pos.Telefone
      deputado.evidencia = pos.evidencia
    }
    return deputado
  }

  React.useEffect( () => {
    request('deputados',
            (data) =>
              setState({...state, deputados: data.map( deputado => addPosicao(deputado) ) }),
            (error) => setState({...state, error: {...state.error, ...error}})
          )
  }, [])
  React.useEffect( () => {
    if(state.deputados.length > 0 && !state.mesaDiretora)
      request('orgaos/4/membros',
              (data) => setState({...state, mesaDiretora: data}),
              (error) => setState({...state, error: {...state.error, ...error}})
            )
  })

  React.useEffect( () => {
    if(state.deputados.length > 0 && state.partidoPage < 4)
      request(`partidos?pagina=${state.partidoPage}&itens=15`,
              (data) => setState({...state, partidos: [...state.partidos, ...data], partidoPage: state.partidoPage + 1}),
              (error) => setState({...state, error: error})
              )
  })

  React.useEffect( () => {
    if(!state.orgaos && state.deputados.length > 0 && state.partidoPage === 4)
      request('orgaos', (data) => setState({...state, orgaos: data}), (error) => setState({...state, error: error}))
  }, [])

  if(state.error)
    console.log(state.error)

  return (
    <div className="App">
      <Home deputados={state.deputados} partidos={state.partidos} mesaDiretora={state.mesaDiretora}/>
    </div>
  );
}

export default App;
