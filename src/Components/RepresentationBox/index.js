const RepresentationBox = ({configList}) => {
    const createdList = []
    for(let i = 0; i < configList.length; i++){
        for(let j = 0; j < configList[i].count; j++){
            createdList.push({color: configList[i].color, title: configList[i].title})
        }
    }
    const boxWidth = 500
    const radius = 5
    const elementHeight = 2*radius
    const elementWidth = 2*radius
    const columns = boxWidth / elementWidth //50 colunas
    const boxHeight = elementHeight * (createdList.length / columns + 1); 
    const lines = boxHeight / elementHeight //15 linhas
    return(
        <div>
            <div>Composição atual da Câmara dos Deputados</div>
            <svg width={boxWidth} height={boxHeight} style={{border: '2px solid black'}} xmlns="http://www.w3.org/2000/svg">
                {createdList.map((value, index) =>
                    <rect key={index} x={(elementWidth* (index % columns))} y={elementHeight*( Math.floor(index / columns))} width={elementWidth} height={elementHeight} fill={value.color}>
                        {value.title && <title>{value.title}: {configList.find(c => c.title === value.title).count}</title>}
                    </rect>
                )}
            </svg>
        </div>
    )
}

export default RepresentationBox