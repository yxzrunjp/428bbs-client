export const sizeTranslate = (size) => {
    let sizeStr = ''
    if (size < 0.1 * 1024) {
        sizeStr = size.toFixed(2) + 'B'
    } else if (size < 0.1 * 1024 * 1024) {
        sizeStr = (size / 1024).toFixed(2) + 'KB'
    } else if (size < 0.1 * 1024 * 1024 * 1024) {
        sizeStr = (size / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
        sizeStr = (size / (1024 * 1024 * 1024)).toFixed(2) + 'MB'
    }
    // const numStr = sizeStr.split('.')[1].slice(0,2)
    // if (numStr==='00') {
    //     const idx = sizeStr.indexOf('.')
    //     const arr= sizeStr.split('')
    //     arr.splice(idx+1,2)
    //     return arr.join(',')
    // }else{
    //     return sizeStr
    // }
    return sizeStr
}