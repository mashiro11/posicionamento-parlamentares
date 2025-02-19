import React from 'react'
import Deputado from '../Components/Deputado'
import UsableChip from '../Components/UsableChip'

import Chip from '@material-ui/core/Chip'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Button from '@material-ui/core/Button'

import { estados } from '../auxData.js'

const Home = ({deputados, partidos, mesaDiretora}) => {
  const [state, setState] = React.useState({
    noShowPartido: [],
    noShowEstado:[],
    groupBy: 0,
    groups: ['estado', 'partido'],
    searchDeputado: '',
    deputadoDetailed: {},
    deputadoKept: {},
    deputadosPorEstado: [],
    deputadosPorPartido: []
  })

  React.useEffect(()=>{
    setState({...state,
      deputadosPorEstado: deputados.reduce((acc, deputado) => {
                            let found = acc.find(a => a.estado === deputado.siglaUf)
                            if(!found)
                              return [...acc, {estado: deputado.siglaUf, count: 1}]
                            else{
                              found.count += 1
                              return acc
                            }
                          } , []),
      deputadosPorPartido: deputados.reduce((acc, deputado) => {
                            let found = acc.find(a => a.partido === deputado.siglaPartido)
                            if(!found)
                              return [...acc, {partido: deputado.siglaPartido, count: 1}]
                            else{
                              found.count += 1
                              return acc
                            }
                          } , [])
  })}, [deputados])

  const onPartidoSelect = (partido) =>
    setState({...state, noShowPartido: [...state.noShowPartido.filter( noS => partido !== noS)] })

  const onPartidoDeselect = (partido) =>
    setState({...state, noShowPartido: [...state.noShowPartido, partido]})

  const onEstadoSelect = (estado) =>
    setState({...state, noShowEstado: [...state.noShowEstado.filter( noS => estado !== noS)] })

  const onEstadoDeselect = (estado) =>
    setState({...state, noShowEstado: [...state.noShowEstado, estado]})

  const handleGroupBy = (event, value) =>
    setState({...state, groupBy: value})

  const onSearchChange = (e) =>
    setState({...state, searchDeputado: e.target.value.toLowerCase()})

  const style = {
    display: 'flex', flexWrap: 'wrap',
    justifyContent: 'space-around'
  }

  const onDeputadoEnter = (deputado) => () => setState({...state, deputadoDetailed: deputado })

  const onDeputadoExit = () => setState({...state, deputadoDetailed: state.deputadoKept })
  const onDeputadoClick = (deputado) => () => setState({...state, deputadoDetailed: deputado, deputadoKept: deputado})

  const onFilterChange = type => e => {
    switch(e.target.value){
      case 'Todos':
        setState({...state, [`noShow${type}`]:[]})
        break
      case 'Nenhum':
        setState({...state, [`noShowPartido${type}`]: partidos.reduce((acc, partido) => [...acc, partido.sigla], [])})
        break
      default:

        break
    }
  }

  const filterDeputados = (pos, deputados) => {
    let filtered = deputados
      .filter( deputado => !state.noShowPartido.find( noS => noS === deputado.siglaPartido))
      .filter( deputado => !state.noShowEstado.find( noS => noS === deputado.siglaUf))
      .filter( deputado => pos.pos === deputado.posicao)
      .filter( deputado => state.searchDeputado === '' || deputado.nome.toLowerCase().includes(state.searchDeputado) )

      return(
        <div>
          <div>{pos.title}: {filtered.length}</div>
          <div style={style}>
            {filtered.map( (deputado, index) =>
              <div onMouseEnter={onDeputadoEnter(deputado)}
              onClick={onDeputadoClick(deputado)}
              onMouseLeave={onDeputadoExit}>
                <Deputado key={index} deputado={deputado}
                  selected={deputado === state.deputadoKept}
                />
              </div>
            )}
          </div>
        </div>
      )
  }
  return(
    <div>
      <h2>Entre em contato com os Deputados de seu Estado e cobre um posicionamento!</h2>
      <div style={{display: 'grid', gridTemplateColumns: '150px auto 350px'}}>
        <div>
          <div>
            Em discussão
            {['tema 1', 'tema 2', 'tema 3'].map((tema, index) =>
              <div key={index}><Button onClick={()=>{}}>{tema}</Button></div>
            )}
          </div>
          <div>
            Votações anteriores
            {['tema 1', 'tema 2', 'tema 3'].map((tema, index) =>
              <div key={index}><Button onClick={()=>{}}>{tema}</Button></div>
            )}
          </div>
        </div>
        <div>
          <div>
            <h3>Comando da Câmara dos Deputados:</h3>
            <div style={style}>
              {mesaDiretora && mesaDiretora.map((deputado, index) =>
                <div key={index}>
                  <div>{deputado.titulo}</div>
                  <div
                    onMouseEnter={onDeputadoEnter(deputado)}
                    onClick={onDeputadoClick(deputado)}
                    onMouseLeave={onDeputadoExit}
                    style={state.deputadoKept === deputado? {backgroundColor:  'white'} : {}}
                  >
                    <Deputado deputado={deputado}/>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Tabs value={state.groupBy} onChange={handleGroupBy}>
            <Tab label='Estado'/>
            <Tab label='Partido'/>
          </Tabs>
          <span>
            Filtros:
            <select style={{maxWidth: '33%'}} onChange={onFilterChange("Partido")}>
              <option label='Todos'/>
              <option label='Nenhum'/>
              {partidos
                .sort((left, right) => { if(left.sigla < right.sigla){ return -1 } else if(left.sigla > right.sigla){ return 1 }else{ return 0} })
                .map((partido, index) =>
                  <option key={index} label={partido.sigla} title={partido.nome} />
              )}
            </select>
            <select style={{maxWidth: '33%'}} onChange={onFilterChange("Estado")}>
              <option label='Todas'/>
              <option label='Nenhuma'/>
              {estados.map((estado, index) =>
                <option
                  key={index} label={estado.sigla} title={estado.nome}
                />
              )}
            </select>
            <input type='text' value={state.searchDeputado} onChange={onSearchChange} placeholder='Nome do deputado'/>
          </span>

          <div>
            <h3>Todos os deputados:</h3>
            {deputados && (function groupBy(groupBy){
                switch(state.groups[groupBy]){
                  case 'posicionamento':
                    return (
                      <div>
                        <div>Fonte: <a href='https://datastudio.google.com/u/0/reporting/26c8c95c-175f-4ca3-888d-0bfbccf73e1b/page/5KGxB'>Placar do Impeachment</a> </div>
                        <div style={style}>
                          {[{pos: 'contrario', title: 'CONTRÁRIOS' },
                            {pos:'none', title: 'SEM DEFINIÇÃO'},
                            {pos:'favoravel', title: 'FAVORÁVEIS'},]
                            .map((pos, index) =>
                              <div key={index} style={{maxWidth: '33%', backgroundColor: pos.pos==='contrario' ? '#eeaaaa' : pos.pos === 'favoravel' ? '#aaaaee' : '#dddddd'}}>
                                {filterDeputados(pos, deputados)}
                              </div>
                          )}
                        </div>
                      </div>
                    )
                  case 'estado':
                    return (
                      <div>
                        {estados
                          .filter( estado => !state.noShowEstado.find((noS) => noS === estado.sigla))
                          .map((estado, index) =>
                            <div key={index} style={{backgroundColor: index % 2 === 0? '#CCCCCC' : '#999999'}}>
                              <div>{estado.nome} ({estado.sigla}) {(() => {
                                  let found = state.deputadosPorEstado.find( dE => dE.estado === estado.sigla)
                                  return found? found.count : 0
                                })()} Deputados</div>
                              <div style={style}>
                                {deputados
                                  .filter( deputado => !state.noShowPartido.find((noS) => noS === deputado.siglaPartido))
                                  .filter( deputado => estado.sigla === deputado.siglaUf)
                                  .filter( deputado => state.searchDeputado === '' || deputado.nome.toLowerCase().includes(state.searchDeputado) )
                                  .map( (deputado, index) =>
                                    <div  key={index}
                                      onMouseEnter={onDeputadoEnter(deputado)}
                                      onClick={onDeputadoClick(deputado)}
                                      onMouseLeave={onDeputadoExit}
                                      style={state.deputadoKept === deputado? {backgroundColor:  'white'} : {}}
                                    >
                                      <Deputado deputado={deputado} />
                                    </div>)}
                              </div>
                            </div>
                        )}
                      </div>
                    )
                  case 'partido':
                    return (
                        <div>
                          {partidos
                            .filter( partido => !state.noShowPartido.find((noS) => noS === partido.sigla))
                            .map((partido, index) =>
                              <div key={index} style={{backgroundColor: index % 2 === 0? '#CCCCCC' : '#999999'}}>
                                <div>{partido.nome} ({partido.sigla}) {(() => {
                                    let found = state.deputadosPorPartido.find( dP => dP.partido === partido.sigla)
                                    return found? found.count : 0
                                  })()} Deputados</div>
                                <div style={style}>
                                  {deputados
                                    .filter( deputado  => partido.sigla === deputado.siglaPartido)
                                    .filter( deputado  => !state.noShowEstado.find((noS) => noS === deputado.siglaUf))
                                    .filter( deputado => state.searchDeputado === '' || deputado.nome.toLowerCase().includes(state.searchDeputado) )
                                    .map( (deputado, index) =>
                                      <div key={index}
                                        onMouseEnter={onDeputadoEnter(deputado)}
                                        onMouseLeave={onDeputadoExit}
                                        style={state.deputadoKept === deputado? {backgroundColor:  'white'} : {}}
                                      >
                                        <Deputado key={index} deputado={deputado} onClick={onDeputadoClick(deputado)} />
                                      </div>
                                      )}
                                </div>
                              </div>
                          )}
                        </div>
                    )
                  default:
                    return (
                      <div style={style}>
                        {deputados
                          .filter( deputado => !state.noShowPartido.find((noS) => noS === deputado.siglaPartido))
                          .filter( deputado => !state.noShowEstado.find((noS) => noS === deputado.siglaUf))
                          .filter( deputado => state.searchDeputado === '' || deputado.nome.toLowerCase().includes(state.searchDeputado) )
                          .map((deputado, index) =>
                            <Deputado key={index} deputado={deputado} />)}
                      </div>
                    )
              }
            })(state.groupBy)}
          </div>
        </div>
        <div>
          <Deputado deputado={state.deputadoDetailed} detailed/>
        </div>
      </div>
    </div>
  )
}
/*
[{pos: 'contrario', title: 'CONTRÁRIOS' },
  {pos:'none', title: 'SEM DEFINIÇÃO'},
  {pos:'favoravel', title: 'FAVORÁVEIS'},]
  .map((pos, index) => {
    switch(state.groups[groupBy]){
      case 'estado':
        return()
      case 'partido':
        return()
      case 'partido/estado':
        return()
      case 'estado/partido':
        return()
      default:
        return()
  })
*/
/*

<svg width='80%' height='500' style={{border: '1px solid #000000'}}>
  {deputados.length > 0 && deputados.map((deputado, index) =>
    <g transform={`translate(${50* (index % 30)}, ${50* Math.floor(index / 30)})`}>
      <defs>
        <clipPath id={deputado.id}>
           <circle cx='25' cy='25' r='25' stroke="black" strokeWidth="3"/>
        </clipPath>
      </defs>
      <image width="50" height="50" href={deputado.urlFoto} clipPath={`url(#${deputado.id})`} />
    </g>
  )}
</svg>
*/

export default Home
