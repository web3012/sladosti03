const node_xml_stream = require('node-xml-stream')
const parser = new node_xml_stream()
const fs = require('fs')

let n = 0
let curr_path_arr = []
let curr_path_str = ""
let curr_name = ""

let need = false
let dat = []
let list = []

parser.on('opentag', function (name, attrs) {
    n++;
    let a = name.split(" ")
    curr_name = a[0]
    curr_path_arr.push(curr_name)
    curr_path_str = curr_path_arr.slice().join("-")

    //console.log("OPEN > ", n, curr_path_str)

    // Начало нужного тэга
    if (curr_path_str === 'КоммерческаяИнформация-ПакетПредложений-Предложения-Предложение') {
        //console.log("RESET RECORD > ")
        dat = []
        need = true
    }
})

parser.on('closetag', function (name) {

    //console.log("CLOSE > ", n, curr_path_str, `\n`)

    if (need) {
        //console.log(">", curr_path_str, name)
    }

    // Конец нужного тэга
    if (curr_path_str === 'КоммерческаяИнформация-ПакетПредложений-Предложения-Предложение') {
        //console.log("RESET RECORD > ")
        need = false

        list.push(dat)
    }

    curr_path_arr.pop()
    curr_path_str = curr_path_arr.slice().join("-")
})

parser.on('text', function (text) {
    //console.log(curr_name, " > ", text)

    if (need) {
        dat[curr_name] = text
    }
})

parser.on('finish', function () {
    console.log("-=finish=-")
    console.log("list", list)

})

let stream = fs.createReadStream('./public/1cbitrix/offers.xml', 'UTF-8')
stream.pipe(parser)


