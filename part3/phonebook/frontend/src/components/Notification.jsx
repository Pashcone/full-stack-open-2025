const Notification = ({ message }) => {
  const notificationColor = {
    color: message.color,
  }
  if (message.text === null) {
    return null
  }

  return (
    <div className='error' style={notificationColor}>
      {message.text}
    </div>
  )
}

export default Notification