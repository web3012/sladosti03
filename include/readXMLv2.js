export async function readXML(path_to_xml_file, need_path, need_path_child) {

    // =======================================================
    // simple wait func
    // =======================================================
    function wait(t) {
        return new Promise(r => {
            setTimeout(r, t)
        })
    }

    // =======================================================
    // stream and parser
    // =======================================================
    const fs = require('fs')
    const stream = fs.createReadStream(path_to_xml_file, {highWaterMark: 100, encoding: 'UTF-8'})
    const node_xml_stream = require('node-xml-stream')
    const parser = new node_xml_stream()
    stream.pipe(parser)

    // =======================================================
    // somer var
    // =======================================================
    let n = 0
    let curr_path_arr = []
    let curr_path_str = ""
    let curr_name = ""
    let need = false
    let lavel = 0
    let dat = []
    let list = []

    // =======================================================
    // parser.on
    // =======================================================
    parser.on('opentag', function (name, attrs) {
        n++;
        let a = name.split(" ")
        curr_name = a[0]
        curr_path_arr.push(curr_name)
        curr_path_str = curr_path_arr.slice().join("-")
        console.log("OPEN > ", n, curr_path_str)
        // Начало нужного тэга
        if (curr_path_str === need_path) {
            console.log("OPEN RESET RECORD > ")
            dat = []
            need = true
            lavel = -2;
        }
        if (curr_path_str === need_path_child) {
            console.log("OPEN CHILD > ")
        }        
        lavel++;
    })

    parser.on('closetag', function (name) {
        console.log("CLOSE > ", n, curr_path_str, `\n`)
        // Конец нужного тэга
        if (curr_path_str === need_path) {
            console.log("CLOSE RESET RECORD > ")
            list.push(Object.fromEntries(dat))
            dat = []
            need = false
            
        }
        if (curr_path_str === need_path_child) {
            console.log("CLOSE CHILD > ")
        }        

        curr_path_arr.pop()
        curr_path_str = curr_path_arr.slice().join("-")
        lavel--;
    })

    parser.on('text', async (text) => {
        console.log("TEXT", " > ", curr_name, " = ", text)
        if (need) {

            let fieldname = curr_path_str.replace(need_path + '-', `${lavel}`)

            let exist = false
            dat.map((el, n)=>{
                if(el[0] === fieldname){
                    exist = n                    
                }
            })

            if(exist === false){
                dat.push([fieldname, text])
            }else{
                let val = dat[exist][1]
                // Преобразовываем text в массив
                if(typeof val === "string"){
                    val = [val, text]
                }else{
                    val.push(text)
                }
                dat[exist] = [fieldname, val]
            }
            
        }

    })

    parser.on('finish', function () {
        console.log("-=parser finish=-")
        
    })

    // =======================================================
    // for await
    // =======================================================
    for await (const chunk of stream) {
        //console.log(">>>>> ", chunk)
        //await wait(3000)
    }

    // =======================================================
    // finish
    // =======================================================
    await wait(10)
    console.log("-=stream finish=-")

    return {msg: "Complite ok !", result: list}
}

