import React from 'react'
import { request } from '../../request.js'


const Despesas = ({id}) => {
    const [despesas, setDespesas] = React.useState([])
    const [loadPageInfo, setLoadPageInfo] = React.useState({lastPageReceived: 0, lastPageIndex: 0})

    const despesasPorTipo = (list) => {
        return list.reduce((acc, d) => 
            {
                const found = acc.find(f => f.tipoDespesa === d.tipoDespesa)
                if(found)
                    found.despesas.push(d)
                else
                    acc.push({tipoDespesa: d.tipoDespesa, despesas: [d]})

                return acc 
            }, [])
    }
    const despesasPorAno = (list) => {
        return list.reduce((acc, d) => 
            {
                const found = acc.find(f => f.ano === d.ano)
                if(found)
                    found.despesas.push(d)
                else
                    acc.push({ano: d.ano, despesas: [d]})

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

    return(
        <div>
            <div>Despesas:</div>
            {despesas?
                <div>
                    <div>Total: {despesas.reduce((acc,d) => acc + d.valorLiquido, 0)}</div>
                    <div>
                        {despesasPorTipo(despesas).map((despesa, index) => 
                            <div key={index}>
                                <div>Tipo: {despesa.tipoDespesa}</div>
                                <div>Total: {despesa.despesas.reduce((acc,d) => acc + d.valorLiquido, 0)}</div>
                            </div>
                        )}
                    </div>
                    <div>
                        {despesasPorAno(despesas).map((despesa, index) => 
                            <div key={index}>
                                <div>Ano: {despesa.ano}</div>
                                <div>Total: {despesa.despesas.reduce((acc,d) => acc + d.valorLiquido, 0)}</div>
                            </div>
                        )}
                    </div>
                </div>
            :null}
        </div>
    )
}

export default Despesas