

export async function getGatalogFromID(path_to_xml_file, ID) {

    let obj = {}
    let n = 0

    let lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(path_to_xml_file)
    })


    const start = async () => {
        let buffer = ""
        let matches

        for await (const line of lineReader) {

            buffer += line

            // Проверка по регулярке
            matches = buffer.match(/<Группа>(.*?)<\/Наименование>/m)
            if (matches) {

                n++;
                let xml = matches[0]
                buffer = "" //сброс буфера

                if (xml.match(`<Ид>${ID}<\/Ид>`)) {

                    let title = xml.match(/<Наименование>(.*?)<\/Наименование>/)
                    obj.id = ID
                    obj.title = title[1]
                    //console.log(">>>>>>>>>", obj)           

                    lineReader.close()
                }

            }
        }

        // console.log("FINISH")
        // console.log("N=", n)
        // console.log("OBJ=", obj)

        return  new Promise((resolve, rej)=>{
            resolve(obj)
        })
    
    }

    let res = await start()
    return res

}
