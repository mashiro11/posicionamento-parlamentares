import React from 'react'
import { request } from '../../request.js'
import '../Deputado/styles.css'
import Button from '@material-ui/core/Button'
import {formater} from '../../utils.js'

const DeputadoListItem = ({deputado, selected, detailed, onClose, requestDespesas, onClick}) => {

    const despesaResumo = deputado.despesasDownloaded? deputado.despesas.reduce((acc, despesa) => 
        (
            {
                total: acc.total + despesa.valorLiquido,
                start: Math.min(despesa.ano, acc.start),
                end: Math.max(acc.end, despesa.ano) 
            }
        ), {total: 0, start: 9999, end: 0})
        : {total: 0, start: 9999, end: 0}

    return(
    <Button onClick={onClick? onClick: null}>
      <div className='retrato'>
        <div>
          <img src={deputado.urlFoto} style={{maxWidth: 70, borderRadius: 30}}/>
        </div>
        <div style={{fontSize: 12}}>{deputado.nome}</div>
        <div style={{fontSize: 12}}>{deputado.nomeCivil}</div>
        <div style={{fontSize: 14}}>{deputado.siglaPartido}</div>
        <div>{deputado.siglaUf}</div>
        {deputado.despesasDownloaded ?
            <div>Despesa: {formater.format(despesaResumo.total)} {despesaResumo.start}-{despesaResumo.end}</div>
            : <div>Baixando despesas...</div>
        }
      </div>
    </Button>
  )
}

export default DeputadoListItem
