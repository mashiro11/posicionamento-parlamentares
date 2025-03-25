import React from 'react'
import Deputado from '../Components/Deputado'
import DeputadoListItem from '../Components/DeputadoListItem'
import RepresentationBox from '../Components/RepresentationBox'
import MesaDiretora from '../Components/MesaDiretora'
import UsableChip from '../Components/UsableChip'

import Chip from '@material-ui/core/Chip'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Button from '@material-ui/core/Button'

import { estados } from '../auxData.js'
import GroupDeputados from '../Components/GroupDeputados/GroupDeputados.js'
import fs from 'fs'

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

  const [allData, setAllData] = React.useState("")

  const [orderBy, setOrderEstadoBy] = React.useState(0)

  const colors = ["#72cb26", "#345718", "#e68d8d", "#7d1e1e","#d6ab4d", 
                  "#694e10", "#c1c920", "#7d8226", "#638224", "#97bd4c", 
                  "#1d6910", "#24a390", "#17edd0", "#11c0db", "#5a8991",
                  "#075ab8", "#63a2eb", "#08356b", "#545699", "#9495e0",
                  "#472894", "#675c80", "#9241d1", "#410073", "#9f46b5",
                  "#871875", "#857e84"
                 ]

  React.useEffect(()=>{
    setState({...state,
      deputadosPorEstado: deputados.reduce((acc, deputado) => {
                            let found = acc.find(a => a.title === deputado.siglaUf)
                            if(!found)
                              return [...acc, {title: deputado.siglaUf, name: estados.find(e => e.sigla === deputado.siglaUf).nome, list: [deputado], color: colors[acc.length % colors.length]}]
                            else{
                              found.list.push(deputado)
                              return acc
                            }
                          } , []),
      deputadosPorPartido: deputados.reduce((acc, deputado) => {
                            let found = acc.find(a => a.title === deputado.siglaPartido)
                            if(!found)
                              return [...acc, {title: deputado.siglaPartido, list: [deputado], color: colors[acc.length % colors.length]}]
                            else{
                              found.list.push(deputado)
                              return acc
                            }
                          } , [])
    })
  }, [deputados])

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

  const handleOrderBy = (event, value) =>
    setOrderEstadoBy(value)

  const onSearchChange = (e) =>
    setState({...state, searchDeputado: e.target.value.toLowerCase()})

  const style = {
    display: 'flex', flexWrap: 'wrap',
    justifyContent: 'space-around'
  }

  const onDeputadoEnter = (deputado) => () => {}//setState({...state, deputadoDetailed: deputado })

  const onDeputadoExit = () => setState({...state, deputadoDetailed: state.deputadoKept })
  const onDeputadoClick = (deputado) => () => setState({...state, deputadoDetailed: deputado, deputadoKept: deputado})

  const onDetailedClose = () => setState({...state, deputadoDetailed: {}, deputadoKept: {}})

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

  const applySort = (groupByList) => {
    return groupByList.toSorted( (a, b) => {
      switch(orderBy){
        case 0:
          return a.name > b.name? 1 : (b.name > a.name? -1 : 0)
        case 1:
          return b.list.length - a.list.length 
      } 
    })
  }

  const applyDeputadoFilters = (deputados) => {
    return deputados.filter(d => d.nome.includes)
  }

  const showDeputadosByCriteria = (criteria) => {
      let sorted
      switch(criteria){
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
          sorted = applySort(state.deputadosPorEstado)
          return (
            <div>
              <RepresentationBox configList={sorted}/>
              {sorted.map((group, index) =>
                <GroupDeputados key={index} index={index} group={group} onDeputadoMouseEnter={onDeputadoEnter} onDeputadoMouseExit={onDeputadoExit} onDeputadoClick={onDeputadoClick} style={style}/>
              )}
            </div>
          )
        case 'partido':
          sorted = applySort(state.deputadosPorPartido);
          return (
              <div>
                <RepresentationBox configList={sorted}/>
                {sorted.map((group, index) => 
                  <GroupDeputados key={index} index={index} group={group} onDeputadoMouseEnter={onDeputadoEnter} onDeputadoMouseExit={onDeputadoExit} onDeputadoClick={onDeputadoClick} style={style}/>
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
                  <DeputadoListItem key={index} deputado={deputado} onClick={() => onDeputadoClick(deputado)}/>)}
            </div>
          )
    }
  }

  const onSaveDataToJson = () => {
    setAllData(JSON.stringify(deputados), null, 2)
  }

  return(
    <div>
      <Button onClick={onSaveDataToJson}>Salvar em json</Button>
      <h2>Entre em contato com os Deputados de seu Estado e cobre um posicionamento!</h2>
      <div style={{display: 'grid', gridTemplateColumns: `auto ${(Object.keys(state.deputadoDetailed).length? "550":"0")}px`}}>
        {/*
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
        */}
        <div>
          <MesaDiretora mesaDiretora={mesaDiretora} onDeputadoEnter={onDeputadoEnter} onDeputadoClick={onDeputadoClick} onDeputadoExit={onDeputadoExit}/>
          <Tabs value={state.groupBy} onChange={handleGroupBy}>
            <Tab label='Estado'/>
            <Tab label='Partido'/>
            <Tab label='Todos'/>
          </Tabs>
          <Tabs value={orderBy} onChange={handleOrderBy}>
            <Tab label='A-Z'/>
            <Tab label='Quantidade de Deputados'/>
          </Tabs>
          {/*
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
          */}

          <div>
            <h3>Todos os deputados:</h3>
            {deputados && showDeputadosByCriteria(state.groups[state.groupBy])}
          </div>
        </div>
        <div>
          <Deputado deputado={state.deputadoDetailed} detailed onClose={onDetailedClose}/>
        </div>
      </div>
      <div>
        {allData}
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
