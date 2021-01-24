import React from 'react'

import Paper from '@material-ui/core/Paper'
import EmailIcon from '@material-ui/icons/Mail'

const Deputado = ({deputado}) => {
  let style = {
    display: 'flex',
    textAlign: 'left',
    marginTop: 5,
    marginBotton: 5
  }
  if(deputado.posicao)
    style.backgroundColor = deputado.posicao === 'favoravel' ? '#7F90FF' : deputado.posicao === 'contrario' ? '#F6BDA8' : '#dddddd'

  return(
    <Paper style={style}>
      <div>
        <img src={deputado.urlFoto} style={{maxWidth: 70}}/>

      </div>
      <div>
          <div>{deputado.nome}</div>
          <div>{deputado.siglaPartido} - {deputado.siglaUf}</div>
          <div>{deputado.tel}</div>
        <div>{deputado.email}</div>
      </div>
    </Paper>
  )
}

export default Deputado
