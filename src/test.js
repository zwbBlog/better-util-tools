const BetterUtilTools = require('./index')
const _ = new BetterUtilTools()
try{
  _.randomColor()
  console.log('better-util-tools is ok!')
}catch(err){
  console.log(err)
}
