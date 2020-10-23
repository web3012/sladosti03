const getFileLife = async (filename) => {
    const fs = require('fs')
    const fsch = require('fs').promises

    try {
        if (fs.existsSync(filename)) {
            let stats = await fsch.stat(filename)
            let dte = new Date()
            let life = Math.floor((dte.getTime() - stats.mtimeMs) / 1000) // время жизни файла в секундах
            return life
        }
    } catch (err) {
        console.error(err)
    }
}

export async function prepareImport(XMLfile) {

    const filename = 'app/data/_catalog/category.json'
    const filename2 = 'app/data/_catalog/products.json'

    const fsp = require('fs').promises

    // Кэширвание 
    let life = await getFileLife(filename)
    let life2 = await getFileLife(filename2)

    if (life < 60 * 5) { //5 мин 
        return { // кэш актуален
            categoryFilename: filename,
            productsFilename: filename2,
            life: await getFileLife(filename),
            life2: await getFileLife(filename2)
        }

    } else {
        try {
            await fsp.unlink(filename)
            await fsp.unlink(filename2)
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    }

    // =======================================================
    // stream and parser
    // =======================================================
    const fs = require('fs')
    const stream = fs.createReadStream(XMLfile, { highWaterMark: 100, encoding: 'UTF-8' })
    const node_xml_stream = require('node-xml-stream')
    const parser = new node_xml_stream()
    stream.pipe(parser)

    // =======================================================
    // some var
    // =======================================================
    let list = [] //категории
    let list2 = [] //товары
    let list3 = [] //реквизиты
    let acat = null // []
    let aobj = []
    let arekv = {}
    let alink = []

    let curr_name = ""
    let curr_path_arr = []
    let curr_path_str = ""
    let curr_path_id = ["root"] // текущая категория
    let need = false // для обработки категорий
    let need2 = false // для обработки товаров

    // =======================================================
    // parser.on
    // =======================================================
    parser.on('opentag', function (name, attrs) {
        curr_name = name.split(" ")[0] //отрезаем аттрибуты
        curr_path_arr.push(curr_name)
        curr_path_str = curr_path_arr.slice().join(".")

        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары") {
            list2 = []
        }
        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар") {
            aobj = []
            need2 = "Товар"
        }
        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар.Группы") {
            alink = []
            need2 = "СвязьСГруппами"
        }

        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар.ЗначенияРеквизитов") {
            list3 = []
            need2 = "Реквизит"
        }

        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар.ЗначениеРеквизита") {
            arekv = {}
            need2 = "Реквизит"
        }
        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар.ЗначенияРеквизитов.ЗначениеРеквизита") {
            arekv = {}
            need2 = "Реквизит"
        }

        //==================================================
        // Начало новой категории
        // Надо сохранить накопленные данные по предыдущей категории (родительской)
        if (
            curr_path_str === "КоммерческаяИнформация.Классификатор.Группы.Группа" ||
            curr_path_str === "КоммерческаяИнформация.Классификатор.Группы.Группа.Группы.Группа" ||
            curr_path_str === "КоммерческаяИнформация.Классификатор.Группы.Группа.Группы.Группа.Группы.Группа" ||
            curr_path_str === "КоммерческаяИнформация.Классификатор.Группы.Группа.Группы.Группа.Группы.Группа.Группы.Группа"
            ) {
                //console.log(">>>> ", curr_path_str)

                // сохраняем накопленные данные о категории
                if(acat !== null){
                    let id = curr_path_id[curr_path_id.length - 1]
                    list.push([id, acat])
                    acat = []
                }
            
                need = "Категория"
                acat = [] //инициируем новую категорию
        }


    })

    parser.on('closetag', function (name) {
        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар.Группы") {
            aobj.push(['link', alink])
            need2 = "Товар"
        }
        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар.ЗначенияРеквизитов") {
            need2 = "Товар"
        }
        
        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар.ЗначениеРеквизита") {
            list3.push()
            switch (arekv.name) {
                case "ОписаниеВФорматеHTML":
                    aobj.push(["desc", arekv.value])
                    break;
            }
            need2 = "Товар"
        }
        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар.ЗначенияРеквизитов.ЗначениеРеквизита") {
            list3.push()
            switch (arekv.name) {
                case "ОписаниеФайла":
                    aobj.push(["fileDescription", arekv.value])
                    break;
                case "Полное наименование":
                    aobj.push(["fullName", arekv.value])
                    break;
                case "Вес":
                    aobj.push(["ves", arekv.value])
                    break;
                case "ОписаниеВФорматеHTML":
                    aobj.push(["desc", arekv.value])
                    break;
                case "Новинка":
                    aobj.push(["new", arekv.value])
                    break;
            }
        }
        if (curr_path_str === "КоммерческаяИнформация.Каталог.Товары.Товар") {
            need2 = false
            list2.push(aobj) // добавляем в список сформированный товар

        }

        // =========================================
        // Категории
        if(
        curr_path_str === "КоммерческаяИнформация.Классификатор.Группы.Группа" ||
        curr_path_str === "КоммерческаяИнформация.Классификатор.Группы.Группа.Группы.Группа" ||
        curr_path_str === "КоммерческаяИнформация.Классификатор.Группы.Группа.Группы.Группа.Группы.Группа" ||
        curr_path_str === "КоммерческаяИнформация.Классификатор.Группы.Группа.Группы.Группа.Группы.Группа.Группы.Группа"
        ){
            //console.log("<<<< ", curr_path_str)
                
            // сохраняем если еще не сохранили 
            // при наличии дочерних категорий родительская сохраняется при начале дочерней категории
            if(acat !== null){
                let id = curr_path_id[curr_path_id.length - 1]
                list.push([id, acat])
            }

            need = false
            acat = null // конец сбора информации
            curr_path_id.pop() // Убираем из стека текущий parent Ид
        }

        // ----------------------------------------------
        curr_path_arr.pop()
        curr_path_str = curr_path_arr.slice().join(".")
    })

    parser.on('text', async (text) => {
        if (need == "Категория") { // Категория

            if (curr_name === "Ид") {
                acat.push(["id", text])
                acat.push(["parent", curr_path_id[curr_path_id.length - 1]])
                curr_path_id.push(text)
            }
            if (curr_name === "Наименование") {
                
                
                acat.push(["title", text])
            }
            if (curr_name === "Картинка") {
                acat.push(["pic", text])
            }

        }
        if (need2 === "Товар") {

            aobj.push([curr_name, text])

        }

        if (need2 === "СвязьСГруппами") {
            if (curr_name === "Ид") {
                alink.push(["id", text])
            }

        }
        if (need2 === "Реквизит") {
            if (curr_name === "Наименование") {
                arekv.name = text
            }
            if (curr_name === "Значение") {
                arekv.value = text
            }
        }

    })

    // =======================================================
    // for await
    // =======================================================
    for await (const chunk of stream) { }

    // =======================================================
    // finish
    // =======================================================
    await fsp.writeFile(filename, JSON.stringify(list))
    await fsp.writeFile(filename2, JSON.stringify(list2))

    return {
        categoryFilename: filename,
        productsFilename: filename2,
        life: await getFileLife(filename),
        life2: await getFileLife(filename2)
    }


}

export async function prepareOffers(XMLfile) {

    const filename = 'app/data/_catalog/price.json'
    const fs = require('fs')
    const fsp = require('fs').promises

    // Кэширвание 
    // =======================================================
    let life = await getFileLife(filename)

    if (life < 60 * 5) { //5 мин
        //console.log("ACTUAL")
        return {
            priceFilename: filename,
            life: await getFileLife(filename),
        }
    } else {
        //console.log("NOT ACTUAL")
        try {
            await fsp.unlink(filename)
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    }

    // =======================================================
    // stream and parser
    // =======================================================
    const stream = fs.createReadStream(XMLfile, { highWaterMark: 100, encoding: 'UTF-8' })
    const node_xml_stream = require('node-xml-stream')
    const parser = new node_xml_stream()
    stream.pipe(parser)

    // =======================================================
    // some var
    // =======================================================
    let list = [] //категории
    let obj = []

    let curr_name = ""
    let curr_path_arr = []
    let curr_path_str = ""
    let need = false

    // =======================================================
    // parser.on
    // =======================================================
    parser.on('opentag', function (name, attrs) {
        curr_name = name.split(" ")[0] //отрезаем аттрибуты
        curr_path_arr.push(curr_name)
        curr_path_str = curr_path_arr.slice().join(".")
        if (curr_path_str === "КоммерческаяИнформация.ПакетПредложений.Предложения.Предложение") {
            need = "Предложение"
            obj = []
        }
    })

    parser.on('closetag', function (name) {
        if (curr_path_str === "КоммерческаяИнформация.ПакетПредложений.Предложения.Предложение") {
            need = false
            list.push(obj)
        }
        curr_path_arr.pop()
        curr_path_str = curr_path_arr.slice().join(".")
    })

    parser.on('text', async (text) => {
        if (need == "Предложение") { // Категория
            obj.push([curr_name, text])
        }
    })

    // =======================================================
    // for await
    // =======================================================
    for await (const chunk of stream) { }

    // =======================================================
    // finish
    // =======================================================
    await fsp.writeFile(filename, JSON.stringify(list))

    // console.log("------------------------------------")
    // let n = 0
    // list.map(el => {
    //     n++;
    //     if (n > 3) return
    //     console.log(el)
    // })

    return {
        priceFilename: filename,
        life: await getFileLife(filename)
    }

}