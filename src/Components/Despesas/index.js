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


const Despesas = ({id, uf}) => {
    const [despesas, setDespesas] = React.useState([])
    const [groupBy, setGroupBy] = React.useState(0)
    const [loadPageInfo, setLoadPageInfo] = React.useState({lastPageReceived: 0, lastPageIndex: 0})
    const [groupedByTypeDespesas, setGroupedByTypeDespesas] = React.useState([])
    const [groupedByYearDespesas, setGroupedByYearDespesas] = React.useState([])
    const monthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

    const formater = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        // These options can be used to round to whole numbers.
        //trailingZeroDisplay: 'stripIfInteger'   // This is probably what most people
                                                // want. It will only stop printing
                                                // the fraction when the input
                                                // amount is a round number (int)
                                                // already. If that's not what you
                                                // need, have a look at the options
                                                // below.
        //minimumFractionDigits: 0, // This suffices for whole numbers, but will
                                    // print 2500.10 as $2,500.1
        //maximumFractionDigits: 0, // Causes 2500.99 to be printed as $2,501
      });

    const groupListByFieldSumField = (list, fieldName, sumField) => {
        return list.reduce((acc, d) => 
            {
                const found = acc.find(f => f[fieldName] === d[fieldName])
                if(found){
                    found.list.push(d)
                    if(sumField)
                        found.value += d[sumField]
                }
                else{
                    acc.push({[fieldName]: d[fieldName], list: [d], value: (sumField? d[sumField] : 0)})
                }
                return acc 
            }, [])
    }
    
    React.useEffect(()=>{
        if(!id)
            return
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
        if(loadPageInfo.lastPageReceived <= loadPageInfo.lastPageIndex)
            request(`deputados/${id}/despesas?pagina=${loadPageInfo.lastPageReceived+1}&itens=15`, (data) => 
            {
                setDespesas([...despesas, ...data])
                setLoadPageInfo({...loadPageInfo, lastPageReceived: loadPageInfo.lastPageReceived + 1})
            })
    }, [loadPageInfo])

    React.useEffect(() => {
        setGroupedByTypeDespesas(groupListByFieldSumField(despesas, "tipoDespesa", "valorLiquido").toSorted((dA, dB) => dB.value - dA.value) )
        setGroupedByYearDespesas(groupListByFieldSumField(despesas, "ano", "valorLiquido").toSorted((dA, dB) => dB.value - dA.value) )
    }, [despesas])
    console.log('groupedDespesas', groupedByTypeDespesas)

    return(
        <div>
            <a href={"https://www2.camara.leg.br/comunicacao/assessoria-de-imprensa/guia-para-jornalistas/cota-parlamentar"}>Detalhes sobre a cota parlamentar</a>
            <div>Valor mensal disponível: {formater.format(cotaMensal[uf])}</div>
            <div>Despesas totais: {despesas && formater.format(despesas.reduce((acc,d) => acc + d.valorLiquido, 0))}</div>
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
                                                <Typography component="span">Total: {formater.format(despesaAgrupada.value)}</Typography>
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
                                                                        <Typography component="span">Total: {formater.format(groupByFornecedor.value)}</Typography>
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
                                                <Typography component="span">{despesaAgrupada.ano}({despesaAgrupada.list.length})</Typography>
                                                <Typography component="span">Total: {formater.format(despesaAgrupada.value)}</Typography>

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
                                                                    <Typography component="span">{monthName[groupByMes.list[0].mes-1]}({groupByMes.list.length})</Typography>
                                                                </div>
                                                                <div>
                                                                    <Typography component="span">Total: {formater.format(groupByMes.value)}</Typography>
                                                                </div>
                                                            </div>
                                                        </AccordionSummary>
                                                        {groupByMes.list.map((detalhamento, index) => 
                                                            <AccordionDetails key={index}>
                                                                <DespesaDetalhada despesa={detalhamento} />
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
    )
}

export default Despesas