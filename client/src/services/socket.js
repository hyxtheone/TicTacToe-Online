import io from 'socket.io-client'

export const socket = await io.connect('http://localhost:3001')
