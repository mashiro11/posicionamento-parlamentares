import React from 'react'
import Deputado from '../Components/Deputado'
import UsableChip from '../Components/UsableChip'

import Chip from '@material-ui/core/Chip'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { estados } from '../auxData.js'

const Home = ({deputados, partidos}) => {
  const [state, setState] = React.useState({noShowPartido: [], noShowEstado:[], groupBy: 0, groups: ['', 'estado', 'partido', 'posicionamento'], searchDeputado: ''})

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
    setState({...state, searchDeputado: e.target.value})

  const style = {
    display: 'flex', flexWrap: 'wrap',
    justifyContent: 'space-around'
  }

  return(
    <div>
      <div>Filtros</div>
      <div style={style}>
        <div style={{maxWidth: '33%'}}>
          <div>Unidade da Federação</div>
          <Chip label='Todas' clickable onClick={() => setState({...state, noShowEstado:[]}) }/>
          <Chip label='Nenhuma' clickable onClick={() => setState({...state, noShowEstado: estados.reduce((acc, estado) => [...acc, estado.sigla], [])})}/>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {estados.map((estado, index) =>
              <UsableChip
                key={index} label={estado.sigla} title={estado.nome}
                onSelect={onEstadoSelect} onDeselect={onEstadoDeselect}
                value={!state.noShowEstado.includes(estado.sigla)}
              />
            )}
          </div>
        </div>

        <div style={{maxWidth: '33%'}}>
          <div>Partidos</div>
          <Chip label='Todos' clickable onClick={() => setState({...state, noShowPartido:[]})} />
          <Chip label='Nenhum' clickable onClick={() => setState({...state, noShowPartido: partidos.reduce((acc, partido) => [...acc, partido.sigla], [])})}/>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {partidos
              .sort((left, right) => { if(left.sigla < right.sigla){ return -1 } else if(left.sigla > right.sigla){ return 1 }else{ return 0} })
              .map((partido, index) =>
                <UsableChip
                  key={index} label={partido.sigla} title={partido.nome}
                  onSelect={onPartidoSelect} onDeselect={onPartidoDeselect}
                  value={!state.noShowPartido.includes(partido.sigla)}
                />
            )}
          </div>
        </div>
        <div>
          <div>Nome:</div>
          <input type='text' value={state.searchDeputado} onChange={onSearchChange} />
        </div>
      </div>

      <Tabs value={state.groupBy} onChange={handleGroupBy}>
        <Tab label='Não agrupar'/>
        <Tab label='Estado'/>
        <Tab label='Partido'/>
        <Tab label='Posicionamento no Impeachment'/>
      </Tabs>

      { (function groupBy(groupBy){
          switch(state.groups[groupBy]){
            case 'posicionamento':
              return (
                <div style={style}>
                  {['contrario', 'favoravel', 'none']
                    .map((pos, index) =>
                      <div key={index} style={{maxWidth: '33%'}}>
                        <div>Fonte: <a href='https://datastudio.google.com/u/0/reporting/26c8c95c-175f-4ca3-888d-0bfbccf73e1b/page/5KGxB'>Placar do Impeachment</a> </div>
                        <div>{pos}</div>
                        <div style={style}>
                          {deputados
                            .filter( deputado => !state.noShowPartido.find( noS => noS === deputado.siglaPartido))
                            .filter( deputado => !state.noShowEstado.find( noS => noS === deputado.siglaUf))
                            .filter( deputado => pos === deputado.posicao)
                            .filter( deputado => state.searchDeputado === '' || deputado.nome.includes(state.searchDeputado) )
                            .map( (deputado, index) =>
                              <Deputado key={index} deputado={deputado} />
                          )}
                        </div>
                      </div>
                  )}
                </div>
              )
            case 'estado':
              return (
                <div>
                  {estados
                    .filter( estado => !state.noShowEstado.find((noS) => noS === estado.sigla))
                    .map((estado, index) =>
                      <div key={index}>
                        <div>{estado.nome} ({estado.sigla})</div>
                        <div style={style}>
                          {deputados
                            .filter( deputado => !state.noShowPartido.find((noS) => noS === deputado.siglaPartido))
                            .filter( deputado => estado.sigla === deputado.siglaUf)
                            .filter( deputado => state.searchDeputado === '' || deputado.nome.includes(state.searchDeputado) )
                            .map( (deputado, index) =>
                              <Deputado key={index} deputado={deputado} />)}
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
                        <div key={index}>
                          <div>{partido.nome} ({partido.sigla})</div>
                          <div style={style}>
                            {deputados
                              .filter( deputado  => partido.sigla === deputado.siglaPartido)
                              .filter( deputado  => !state.noShowEstado.find((noS) => noS === deputado.siglaUf))
                              .filter( deputado => state.searchDeputado === '' || deputado.nome.includes(state.searchDeputado) )
                              .map( (deputado, index) =>
                              <Deputado key={index} deputado={deputado} />)}
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
                    .filter( deputado => state.searchDeputado === '' || deputado.nome.includes(state.searchDeputado) )
                    .map((deputado, index) =>
                      <Deputado key={index} deputado={deputado} />)}
                </div>
              )
        }
      })(state.groupBy)}
    </div>
  )
}

export default Home
