let textFormatting = {
    ucFirst(string){
        let [first, ...rest] = string;
        return `${first.toUpperCase()}${rest.join("")}`;
    }
}

export default textFormatting;