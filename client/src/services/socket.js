import io from 'socket.io-client'

export const socket = await io.connect('http://ec2-3-93-169-135.compute-1.amazonaws.com:9000')
