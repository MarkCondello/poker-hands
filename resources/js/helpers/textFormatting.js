export default {
    ucFirst(string){
        const [first, ...rest] = string
        return `${first.toUpperCase()}${rest ? rest.join("") : ''}`
    },
}