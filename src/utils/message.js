const generateMessage=(text)=>{
    return{
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage=(url)=>{
    return{
        url_link:url,
        createdAt: new Date().getTime()
    }
}


module.exports={
    generateMessage,generateLocationMessage
}