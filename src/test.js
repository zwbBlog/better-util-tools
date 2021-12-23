const BetterUtilTools = require('./index')
const UtilTools = new BetterUtilTools()
try{
  UtilTools.randomColor()
  console.log('better-util-tools is ok!')
}catch(err){
  console.log(err)
}
