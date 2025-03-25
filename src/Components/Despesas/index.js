import React from 'react'
import { request } from '../../request.js'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DespesaDetalhada from '../DespesaDetalhada'
import cotaMensal from '../../cotaMensal.js';
import { groupListByFieldSumField, formater } from '../../utils.js';
import DeputadosContex from '../../Contexts/DeputadosData/index.js';

const Despesas = ({id, uf}) => {
    const deputados = React.useContext(DeputadosContex)
    const deputado = deputados? deputados.find(d => d.id === id) : null
    const [despesas, setDespesas] = React.useState(deputado? deputados.despesas : [])
    const [groupBy, setGroupBy] = React.useState(0)
    const [loadPageInfo, setLoadPageInfo] = React.useState({lastPageReceived: 0, lastPageIndex: 0})
    const [groupedByTypeDespesas, setGroupedByTypeDespesas] = React.useState([])
    const [groupedByYearDespesas, setGroupedByYearDespesas] = React.useState([])
    const monthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    /*
    React.useEffect(() => {
        if(deputado && deputado.despesas)
            setDespesas(deputado.despesas)
    }, [id])

    React.useEffect(()=>{
        if(!id || (deputado && deputado.despesas))
            return
        
        console.log('use effect request via id')
        request(`deputados/${id}/despesas`, (data, links) => {
            setDespesas(data)
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
    }, [id])

    React.useEffect(() => {
        console.log('use effect request via loadPageInfo')

        if(loadPageInfo.lastPageReceived <= loadPageInfo.lastPageIndex)
            request(`deputados/${id}/despesas?pagina=${loadPageInfo.lastPageReceived+1}&itens=15`, (data) => 
            {
                setDespesas([...despesas, ...data])
                setLoadPageInfo({...loadPageInfo, lastPageReceived: loadPageInfo.lastPageReceived + 1})
            })
    }, [loadPageInfo])

    React.useEffect(() => {
        console.log('use effect request via despesas')
        setGroupedByTypeDespesas(groupListByFieldSumField(despesas, "tipoDespesa", "valorLiquido").toSorted((dA, dB) => dB.value - dA.value) )
        setGroupedByYearDespesas(groupListByFieldSumField(despesas, "ano", "valorLiquido").toSorted((dA, dB) => dB.value - dA.value) )
        const deputado = deputados.find(d => d.id === id)
            if(deputado)
                deputado.despesas = despesas
    }, [despesas])
    console.log('groupedDespesas', groupedByTypeDespesas)
*/
    return(
        <div>
            {!deputado.despesasDownloaded? <div>BaixandoDespesas...</div>
            :<div>
                <a href={"https://www2.camara.leg.br/comunicacao/assessoria-de-imprensa/guia-para-jornalistas/cota-parlamentar"}>Detalhes sobre a cota parlamentar</a>
            <div>Valor mensal disponível: {formater.format(cotaMensal[uf])}</div>
            <div style={{fontWeight: "bold"}}>Despesas totais: {despesas && formater.format(despesas.reduce((acc,d) => acc + d.valorLiquido, 0))}</div>
            {despesas?
                <div>
                    <Tabs value={groupBy} onChange={(event, value) => setGroupBy(value)}>
                        <Tab label='Tipo de despesa'/>
                        <Tab label='Ano'/>
                    </Tabs>
                    <div>
                        {(() => {
                            //agrupado por tipo de despesa
                            switch(groupBy){
                                case 0:
                                    return groupedByTypeDespesas.map((despesaAgrupada, index) => 
                                        <Accordion key={index}>
                                            <AccordionSummary
                                            expandIcon={<ArrowDropDownIcon />}
                                            aria-controls="panel2-content"
                                            id="panel2-header"
                                            >
                                                <Typography component="span">{despesaAgrupada.tipoDespesa}({despesaAgrupada.list.length})</Typography>
                                                <Typography component="span" style={{fontWeight: "bold"}}>Total: {formater.format(despesaAgrupada.value)}</Typography>
                                            </AccordionSummary>
                                                {groupListByFieldSumField(despesaAgrupada.list, "nomeFornecedor", "valorLiquido").map((groupByFornecedor, index) =>
                                                    <AccordionDetails key={index}>
                                                        <Accordion key={index}>
                                                            <AccordionSummary
                                                            expandIcon={<ArrowDropDownIcon />}
                                                            aria-controls="panel2-content"
                                                            id="panel2-header"
                                                            >
                                                                <div>
                                                                    <div>
                                                                        <Typography component="span">{groupByFornecedor.nomeFornecedor}({groupByFornecedor.list.length})</Typography>
                                                                    </div>
                                                                    <div>
                                                                        <div>CNPJ: </div>
                                                                        <Typography component="span">{groupByFornecedor.list[0].cnpjCpfFornecedor}</Typography>
                                                                    </div>
                                                                    <div>
                                                                        <Typography component="span" style={{fontWeight: "bold"}}>Total: {formater.format(groupByFornecedor.value)}</Typography>
                                                                    </div>
                                                                </div>
                                                            </AccordionSummary>
                                                            {groupByFornecedor.list.toSorted((dA, dB) => dB.dataDocumento > dA.dataDocumento? -1 : (dB.dataDocumento === dA.dataDocumento? 0 : 1) ).map((detalhamento, index) =>
                                                                <AccordionDetails key={index}>
                                                                    <DespesaDetalhada despesa={detalhamento}/>
                                                                </AccordionDetails>
                                                            )}
                                                        </Accordion>
                                                    </AccordionDetails>
                                                )}
                                        </Accordion>
                                    )
                                case 1:
                                    return groupedByYearDespesas.map((despesaAgrupada, index) =>
                                        <Accordion key={index}>
                                            <AccordionSummary 
                                            expandIcon={<ArrowDropDownIcon />}
                                            aria-controls="panel2-content"
                                            id="panel2-header"
                                            >
                                                <Typography component="span">{despesaAgrupada.ano} ({despesaAgrupada.list.length})</Typography>
                                                <Typography component="span" style={{fontWeight: "bold"}}>Total: {formater.format(despesaAgrupada.value)}</Typography>

                                            </AccordionSummary>
                                            {groupListByFieldSumField(despesaAgrupada.list, "mes", "valorLiquido").toSorted((a, b) => a.mes - b.mes).map((groupByMes, index) => 
                                                <AccordionDetails key={index}>
                                                    <Accordion>
                                                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}
                                                            aria-controls="panel2-content"
                                                            id="panel2-header"
                                                        >
                                                            <div>
                                                                <div>
                                                                    <Typography component="span">{monthName[groupByMes.list[0].mes-1]} ({groupByMes.list.length})</Typography>
                                                                </div>
                                                                <div>
                                                                    <Typography component="span" style={{fontWeight: "bold"}}>Total: {formater.format(groupByMes.value)}</Typography>
                                                                </div>
                                                            </div>
                                                        </AccordionSummary>
                                                        {groupListByFieldSumField(groupByMes.list, "tipoDespesa", "valorLiquido").map((groupByType, index) => 
                                                            <AccordionDetails key={index}>
                                                                <Accordion>
                                                                    <AccordionSummary 
                                                                        expandIcon={<ArrowDropDownIcon />}
                                                                        aria-controls="panel2-content"
                                                                        id="panel2-header"
                                                                    >
                                                                        <Typography component="span">{groupByType.tipoDespesa}({groupByType.list.length})</Typography>
                                                                        <Typography component="span" style={{fontWeight: "bold"}}>Total: {formater.format(groupByType.value)}</Typography>
                                                                    </AccordionSummary>
                                                                    {groupListByFieldSumField(groupByType.list, "nomeFornecedor", "valorLiquido").map((groupByFornecedor, index) => 
                                                                        <AccordionDetails key={index}>
                                                                            <AccordionSummary 
                                                                                expandIcon={<ArrowDropDownIcon />}
                                                                                aria-controls="panel2-content"
                                                                                id="panel2-header"
                                                                            >
                                                                                <div>
                                                                                    <div>
                                                                                        <Typography component="span">{groupByFornecedor.nomeFornecedor}({groupByFornecedor.list.length})</Typography>
                                                                                    </div>
                                                                                    <div>
                                                                                        <div>CNPJ: </div>
                                                                                        <Typography component="span">{groupByFornecedor.list[0].cnpjCpfFornecedor}</Typography>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Typography component="span" style={{fontWeight: "bold"}}>Total: {formater.format(groupByFornecedor.value)}</Typography>
                                                                                    </div>
                                                                                </div>
                                                                            </AccordionSummary>
                                                                            {groupByFornecedor.list.map((detalhamento, index) => 
                                                                                <AccordionDetails key={index}>
                                                                                    <DespesaDetalhada despesa={detalhamento} />
                                                                                </AccordionDetails>
                                                                            )}
                                                                        </AccordionDetails>
                                                                    )}
                                                                </Accordion>
                                                            </AccordionDetails>
                                                        )}
                                                    </Accordion>
                                                </AccordionDetails>
                                            )}
                                        </Accordion> 
                                    )
                            }
                        })()}
                    </div>
                </div>
            :null}
            </div>
            }
            
        </div>
    )
}

export default Despesas