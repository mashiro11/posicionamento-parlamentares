import React from 'react'
import { request } from '../../request.js'
import Paper from '@material-ui/core/Paper'
import EmailIcon from '@material-ui/icons/Mail'
import './styles.css'
import Button from '@material-ui/core/Button'

const Deputado = (props) => {
  const {deputado, selected, detailed} = props
  const [state, setState] = React.useState()
  React.useEffect(()=>{
    if(detailed)
      request(`deputados/${deputado.id}`, (data) => setState({...state, deputado: data}), (error) => setState({...state, error: error}))
  },[])
  return(
    <Button onClick={props.onClick? props.onClick : null}>
      {!detailed ?
        <div className='retrato'>
          <div>
            <img src={deputado.urlFoto} style={{maxWidth: 70, borderRadius: 30}}/>
          </div>
          <div style={{fontSize: 12}}>{deputado.nome}</div>
          <div style={{fontSize: 12}}>{deputado.nomeCivil}</div>
          <div style={{fontSize: 14}}>{deputado.siglaPartido}</div>
          <div>{deputado.siglaUf}</div>
        </div>
      :
        <div>
          <div className='retrato'>
            <div>
              <img src={deputado.urlFoto} style={{maxWidth: 150, borderRadius: 30}}/>
            </div>
            <div style={{fontSize: 12}}>{deputado.nome}</div>
            <div style={{fontSize: 14}}>{deputado.siglaPartido}</div>
            <div>{deputado.siglaUf}</div>
          </div>
          <div className='info'>
              {deputado.evidencia &&
                <a href={deputado.evidencia}>Evidencia do posicionamento sobre impeachment</a>
              }
              <div>{deputado.tel}</div>
              <div>{deputado.email}</div>
          </div>
        </div>
      }
    </Button>
  )
}

export default Deputado
