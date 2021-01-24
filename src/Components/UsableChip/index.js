import React from 'react'
import Chip from '@material-ui/core/Chip'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

const Partido = ({label, title, onSelect, onDeselect, value}) => {
  const [state, setState] = React.useState(value)
  const onClick = () => {
    setState(!state)
    if(state){
      if(onDeselect) onDeselect(label)
    }
    else{
      if(onSelect) onSelect(label)
    }
  }
  React.useEffect(() => {
    setState(value)
  }, [value])
  const props = {
    label,
    title,
    onClick,
    clickable: true,
    icon: state ? <RemoveIcon /> : <AddIcon />
  }

  if(!state) props.variant = 'outlined'

  return (
    <Chip {...props} />
  )
}

export default Partido
