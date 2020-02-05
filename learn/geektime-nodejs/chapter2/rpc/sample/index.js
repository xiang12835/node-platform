const buffer1 = Buffer.from('hello node.js')
const buffer2 = Buffer.from([1,2,3])
const buffer3 = Buffer.alloc(20)

console.log(buffer1)
console.log(buffer2)
console.log(buffer3)

buffer2.writeInt8(12,1)
console.log(buffer2)
buffer2.writeInt16BE(512,1)
console.log(buffer2)
buffer2.writeInt16LE(512,1)
console.log(buffer2)
