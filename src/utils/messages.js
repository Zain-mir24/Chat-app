const generateMessage = (text)=>{
    return{
        text,
        createdAt: new Date().getTime()
    }

}
const generateLocationurl=(url)=>{
    return{
        url,
        createdAt: new Date().getTime()
    }
}
module.exports={
    generateMessage,
    generateLocationurl
}