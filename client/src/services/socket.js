import io from 'socket.io-client'

export const socket = await io.connect('http://3.93.169.135:9000')
