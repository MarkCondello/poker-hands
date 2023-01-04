export default {
    ucFirst(string){
        // console.log('ucFirst', string)
        const [first, ...rest] = string
        return `${first.toUpperCase()}${rest ? rest.join("") : ''}`
    },
}