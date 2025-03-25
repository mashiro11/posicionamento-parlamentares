import Typography from '@material-ui/core/Typography';

const DespesaDetalhada = ({despesa: detalhamento}) => {
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
    return(
        <div>
            <div>
                <div>Tipo:{detalhamento.tipoDespesa}</div>
                <div>Data:{detalhamento.dataDocumento}</div>
                {detalhamento.cnpjCpfFornecedor?
                <div>
                    <div>Fornecedor: {detalhamento.nomeFornecedor}</div>
                    <div>CNPJ/CPF: </div>
                    <Typography component="span">{detalhamento.cnpjCpfFornecedor}</Typography>
                </div>
                :<div>
                    Sem CNPJ/CPF.
                </div>
                }
            </div>
            <div>
                <Typography component="span" style={{fontWeight: "bold"}}>Valor: {formater.format(detalhamento.valorLiquido)}</Typography>
            </div>
            <div>
                {detalhamento.urlDocumento?
                    <a href={detalhamento.urlDocumento}>Detalhes</a>
                    :<div>Não possui documento.</div>
                }
            </div>
        </div>
    )
}

export default DespesaDetalhada