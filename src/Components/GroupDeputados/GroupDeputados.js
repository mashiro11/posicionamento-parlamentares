import React from 'react'
import DeputadoListItem from '../DeputadoListItem'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const GroupDeputados = ({group, onDeputadoMouseEnter, onDeputadoMouseExit, onDeputadoClick, style, index}) => {
    const [sortOption, setSortOption] = React.useState(0);
    
    return (
        <div>
            <Tabs value={sortOption} onChange={(_, value) => setSortOption(value)}>
                <Tab label="A-Z"/>
                <Tab label="Gasto"/>
            </Tabs>
          <div style={{backgroundColor: index % 2 === 0? '#CCCCCC' : '#999999'}}>
            <div>{group.name}({group.title}) {group.list.length} Deputados</div>
            <div style={style}>
              {group.list.map( (deputado, index) =>
                  <div  key={index}
                    onMouseEnter={onDeputadoMouseEnter(deputado)}
                    onMouseLeave={onDeputadoMouseExit}
                  >
                    <DeputadoListItem deputado={deputado} requestDespesas={false} onClick={() => onDeputadoClick(deputado)}/>
                  </div>)}
            </div>
          </div>
        </div>
        )
}

export default GroupDeputados