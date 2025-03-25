import Deputado from '../Deputado'

const MesaDiretora = ({mesaDiretora, onDeputadoEnter, onDeputadoClick, onDeputadoExit, selected}) => {
    const style = {
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-around'
    }
    const presidente = mesaDiretora? mesaDiretora.find( deputado => deputado.codTitulo === 1) : null
    const vice = mesaDiretora? mesaDiretora.filter( deputado => deputado.codTitulo > 1 && deputado.codTitulo < 4) : null
    const others = mesaDiretora? mesaDiretora.filter( deputado => deputado !== presidente && !vice.includes(deputado) ) : null
    return(
        <div>
            <h3>Comando da Câmara dos Deputados:</h3>
            <div style={style}>
            { presidente && 
              <div>
                <div>{presidente.titulo}</div>
                  <div
                    onMouseEnter={onDeputadoEnter(presidente)}
                    onClick={onDeputadoClick(presidente)}
                    onMouseLeave={onDeputadoExit}
                  >
                    <Deputado deputado={presidente}/>
                </div>
              </div>
            }
            {vice && vice.map( (deputado, index) =>
              <div key={index}>
                <div>{deputado.titulo}</div>
                <div
                  onMouseEnter={onDeputadoEnter(deputado)}
                  onClick={onDeputadoClick(deputado)}
                  onMouseLeave={onDeputadoExit}
                >
                  <Deputado deputado={deputado}/>
                </div>
              </div>
            )}
            </div>

            <div style={style}>
              {others && others.filter(deputado => deputado.titulo != "Titular").map((deputado, index) =>
                <div key={index}>
                  <div>{deputado.titulo}</div>
                  <div
                    onMouseEnter={onDeputadoEnter(deputado)}
                    onClick={onDeputadoClick(deputado)}
                    onMouseLeave={onDeputadoExit}
                  >
                    <Deputado deputado={deputado}/>
                  </div>
                </div>
              )}
            </div>
        </div>
    )
}

export default MesaDiretora