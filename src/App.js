import React from 'react'
import './App.css';
import Home from './Home'
import { request } from './request.js'
import posicionamento from './posicionamento.json'
import DeputadosContex from './Contexts/DeputadosData/index.js';

const App = (props) => {
  const [deputados, setDeputados] = React.useState([])
  const [downloadingDeputadoIndex, setDownloadingDeputadoIndex] = React.useState(-1)
  const [loadPageInfo, setLoadPageInfo] = React.useState({lastPageReceived: 0, lastPageIndex: 0})
  

  const [ state, setState ] = React.useState({error: null, partidos: [], partidoPage: 1})
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
        setDeputados(data),
      (error) => setState({...state, error: {...state.error, ...error}})
    )
  }, [])

  React.useEffect(() => {
    console.log('useEffect deputados changed to', deputados)
    if(deputados.length > 0 && downloadingDeputadoIndex === -1)
      setDownloadingDeputadoIndex(0)
  }, [deputados])

  React.useEffect(() => {
    console.log('useEffect downloadingDeputadoIndex changed')
    if(deputados.length === 0){
      console.log('deputados.length is zero')
      return
    }

    console.log('request deputado', deputados[downloadingDeputadoIndex].nome, 'despesas')

    request(`deputados/${deputados[downloadingDeputadoIndex].id}/despesas`, (data, links) => {
                deputados.despesas = data
                const first = links.find(l => l.rel === "first")
                const last = links.find(l => l.rel === "last")
                if(first && last){
                    const queryInfo = last.href.substring(last.href.indexOf('?')+1, last.href.length-1)
                    const queryElements = queryInfo.split('&')
                    console.log('queryElements', queryElements);
                    const pageElement = queryElements.find(el => el.includes("pagina"));
                    const lastPageIndex = parseInt(pageElement.split('=')[1])
                    console.log('lastPageIndex', lastPageIndex)
                    setLoadPageInfo({lastPageReceived: 1, lastPageIndex: lastPageIndex});
                }
            })
  }, [downloadingDeputadoIndex])

  React.useEffect(() => {
    if(deputados.length === 0)
      return

    console.log('use effect request via loadPageInfo')

    if(loadPageInfo.lastPageReceived <= loadPageInfo.lastPageIndex)
        request(`deputados/${deputados[downloadingDeputadoIndex].id}/despesas?pagina=${loadPageInfo.lastPageReceived+1}&itens=15`, (data) => 
        {
          const despesas = deputados[downloadingDeputadoIndex].despesas? deputados[downloadingDeputadoIndex].despesas : []
            deputados[downloadingDeputadoIndex].despesas = [...despesas, ...data]
            setLoadPageInfo({...loadPageInfo, lastPageReceived: loadPageInfo.lastPageReceived + 1})
        })
    else{
      const deputadoUpdate = deputados[downloadingDeputadoIndex]
      deputadoUpdate.despesasDownloaded = true
      setDeputados([deputadoUpdate, ...deputados.filter(d => d.id !== deputadoUpdate.id)])
      if(downloadingDeputadoIndex < deputados.length){
        //setDownloadingDeputadoIndex(downloadingDeputadoIndex + 1)
      }
    }
  }, [loadPageInfo])

  React.useEffect( () => {
    if(deputados.length > 0 && !state.mesaDiretora)
      request('orgaos/4/membros',
              (data) => setState({...state, mesaDiretora: data}),
              (error) => setState({...state, error: {...state.error, ...error}})
            )
  })

  React.useEffect( () => {
    if(deputados.length > 0 && state.partidoPage < 4)
      request(`partidos?pagina=${state.partidoPage}&itens=15`,
              (data) => setState({...state, partidos: [...state.partidos, ...data], partidoPage: state.partidoPage + 1}),
              (error) => setState({...state, error: error})
              )
  })

  React.useEffect( () => {
    if(!state.orgaos && deputados.length > 0 && state.partidoPage === 4)
      request('orgaos', (data) => setState({...state, orgaos: data}), (error) => setState({...state, error: error}))
  }, [])

  if(state.error)
    console.log(state.error)

  return (
    <div className="App">
      <DeputadosContex.Provider value={deputados}>
        <Home deputados={deputados} partidos={state.partidos} mesaDiretora={state.mesaDiretora}/>
      </DeputadosContex.Provider>
    </div>
  );
}

export default App;
