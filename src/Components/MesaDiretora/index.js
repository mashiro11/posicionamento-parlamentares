import Deputado from '../Deputado'

const MesaDiretora = ({mesaDiretora, onDeputadoEnter, onDeputadoClick, onDeputadoExit, selected}) => {
    const style = {
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-around'
      }

    return(
        <div>
            <h3>Comando da Câmara dos Deputados:</h3>
            <div style={style}>
              {mesaDiretora && mesaDiretora.filter(deputado => deputado.titulo != "Titular").map((deputado, index) =>
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