import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { color } from '../../vars'

const styles = {
  backgroundColor: color.green,
}

const PlainActionButtonRaised = ({ onClick, label, style }) => (
  <RaisedButton
    label={label}
    primary
    style={Object.assign(styles || {}, style)}
    onMouseUp={onClick}
  />
)

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onClick: () => {
//       dispatch({ type : ownProps.action });
//     }
//   }
// }
//
// export default connect(null, mapDispatchToProps)(PlainActionButton)

export default PlainActionButtonRaised