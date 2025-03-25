import React from 'react'
import { request } from '../../request.js'
import Paper from '@material-ui/core/Paper'
import EmailIcon from '@material-ui/icons/Mail'
import './styles.css'
import Button from '@material-ui/core/Button'
import Despesas from '../Despesas'

const Deputado = (props) => {
  const {deputado, selected, detailed, onClose, requestDespesas} = props
  const [state, setState] = React.useState()
  React.useEffect(()=>{
    if(detailed){
      request(`deputados/${deputado.id}`, (data) => setState({...state, deputado: data}), (error) => setState({...state, error: error}))
    }
  },[])
  return(
    <div>
        <Button onClick={onClose}>Fechar</Button>
      
      <div className='retrato'>
        <div>
          <img src={deputado.urlFoto} style={detailed? {maxWidth: 150, borderRadius: 30} : {maxWidth: 70, borderRadius: 30}}/>
        </div>
        <div style={{fontSize: 12}}>{deputado.nome}</div>
        <div style={{fontSize: 12}}>{deputado.nomeCivil}</div>
        <div style={{fontSize: 14}}>{deputado.siglaPartido}</div>
        <div>{deputado.siglaUf}</div>
        <div className='info'>
            <div>{deputado.tel}</div>
            <div>{deputado.email}</div>
        </div>
        {deputado.despesasDownloaded? 
          <Despesas id={deputado.id} uf={deputado.siglaUf}/>
          : <div>Baixando despesas...</div>
        }
      </div>
    </div>
  )
}

export default Deputado
