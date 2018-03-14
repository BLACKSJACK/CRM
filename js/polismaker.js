/**
 * Класс для работы с PDF
 */
class PolisMaker{
    constructor(){}
    /**
     * Перераспределяем машины по спискам
     * @param {object} myFactory объект с практически всеми нужными данными
     * @return {array} массив со списками машин
     */
    makeCarLists(myFactory) {
        let lists=[];
        myFactory.parks.forEach((park, parkNumber)=>{    
            park.processes.forEach((process, i)=>{
                if(i==0 || !this.areEquivalent(park.processes[i]["cars"],park.processes[i-1]["cars"]) ){
                    lists.push(
                        {
                            cars: park.processes[i]["cars"],
                            processes: [park.processes[i]],
                            risks: [park.processes[i].risk]
                        }
                    )
                }
                else{
                    lists[lists.length-1].processes.push(park.processes[i]);
                    lists[lists.length-1].risks.push(park.processes[i].risk);
                }              
            });
        });
        return lists;
    }
    /**
     * Функция проверки двух соседних строк на идентичность машин, к которым относятся данные строки
     * @param  {array} mass1
     * @param  {array} mass2
     * @return {boolean} возвращает true, если машины идентичны
     */
    areEquivalent(mass1, mass2) {
        if (mass1.length!==mass2.length) return false;
        for(const car of mass1){
            if(!mass2.includes(car)) return false;
        }
        return true;
    }
    /**
     * Создаем массив, который представляет из себя таблицы с рисками и номерами машин
     * @param {object} myFactory объект с практически всеми нужными данными
     * @return {arrayOfTables}
     */
    makeTables(myFactory) {
        let body=[];
        const lists=this.makeCarLists(myFactory);
        
        console.log(lists);
        const listContent=[];
        let listCount=1;
        lists.forEach((list)=>{
            listContent.push(
                "\n",
                {
                    text: `Перечень ${listCount}`,
                    alignment:'center',
                    bold: true,
                },
                "\n"
            );
            listCount++;
            let table={
                style: 'table',
                table: {
                    widths:[68,68,68,84,68,68],
                    body: [
                        [
                            {
                                text:'Допустимая стоимость, руб.', 
                                style:"firstHeader",
                            },
                            {
                                text:`Объем перевозок`,
                                style:"firstHeader", 
                            },
                            {
                                text:'Тип грузового отсека', 
                                style:"firstHeader",
                            },
                            {
                                text:'Риски', 
                                style:"firstHeader",
                            },
                            {
                                text:'Лимит по случаю, руб.', 
                                style:"firstHeader",
                            },
                            {
                                text:'Франшиза по случаю, руб.',
                                style:"firstHeader",
                            }
                        ]
                    ]
                },
                layout: {
                    
                }
            }
            let tableContent=table.table.body;
            list.processes.forEach((process, i)=>{
                let row=[];
                let properties=["cost", "amount", "wrapping", "risk", "limit", "franchise"];
                properties.forEach((property)=>{
                    if(property=="amount"){
                        if(myFactory.amountType=="Тягачей"){
                            row.push(process[property]/24+` ${myFactory.amountType}`);
                        }
                        else{
                            row.push(process[property]+` ${myFactory.amountType}`);
                        }
                    }
                    else if(property=="cost" || property=="limit"){
                        row.push(this.addSpaces(process[property]));
                    }
                    else{
                        row.push(process[property]);
                    }

                })
                tableContent.push(row);
            })
            listContent.push(table, "\n");
            table={
                style: 'table',
                table: {
                    widths:[68,68,68,84,68,68],
                    body: [
                        [
                            {
                                text:'Номер', 
                                style:"firstHeader",
                            },
                            {
                                text:`VIN*`,
                                style:"firstHeader", 
                            },
                            {
                                text:'Год*', 
                                style:"firstHeader",
                            },
                            {
                                text:'Марка*', 
                                style:"firstHeader",
                            },
                            {
                                text:'Включена', 
                                style:"firstHeader",
                            },
                            {
                                text:'Исключена',
                                style:"firstHeader",
                            }
                        ]
                    ]
                },
                layout: {
                    
                }
            }
            tableContent=table.table.body;
            for(const car of list.cars){
                tableContent.push(
                    [
                        {
                            text: car.number
                        },
                        "",
                        "",
                        "",
                        "0.0.2018",
                        "0.0.2019"
                    ]
                )
            }
            listContent.push(table);
        })
        return listContent;
    }
    /**
     * Преобразуем число из 1000000 в 1 000 000 (то есть добавляем пробелы между)
     * @param  {string} nStr 1000000
     * @return {string} 1 000 000
     */
    addSpaces(nStr) {
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2');
        }
        return x1 + x2;
    }
    /**
     * Преобразуем в нужный формат "оговорки и условия"
     * @param  {object} myFactory объект с практически всеми нужными данными
     * @return {array} возвращаем подготовленные для формата pdf данные
     */
    makeParagraphs(myFactory) {
        const paragraphs=[];
        myFactory.polis.forEach((obj,i)=>{
            if(obj.name==="Базовые риски"){
                return;
            }
            if(obj.name==="Не подлежат страхованию грузы"){
                const ul=[];
                obj.values.forEach(value=>ul.push(value));
                paragraphs.push(
                    {
                        text: `2.0 ${obj.name}:\n`,
                        decoration: 'underline',
                        fontSize:16,
                        pageBreak: 'before'
                    },
                    {
                        ul
                    }
                )
                return;
            }
            let paragraph={};
            paragraph.widths=[30, 430];
            paragraph.layout={
                hLineColor: '#e6e6e6',
                vLineColor: '#e6e6e6',
            };
            paragraph.body=[
                [       
                    { 
                        text: `${i+1}. ${obj.name}:`,
                        style: "firstHeader",
                        colSpan:2      
                    },
                    {},
                ]
            ];
            let mass=obj.values.filter(({checked})=>checked);
            mass.forEach((param, num)=>{
                let arr=[];
                arr.push({
                    text:`${i+1}.${num+1}.`
                },{
                    text:param.text
                })
                paragraph.body.push(arr);
            });
            paragraphs.push({
                table:paragraph
            },"\n");
            
        });
        return paragraphs;
        
    }
    /**
     * Создаем два списка
     * 1. Застрахованные риски
     * 2. Незастрахованные риски
     * @param  {object} myFactory объект с практически всеми нужными данными
     * @return {array} возвращаем подготовленные для формата pdf данные
     */
    makeRisksList(myFactory, risks) {
        /**
         * преобразуем массив данных в объект, который войдет в PDF файл в виде списка
         * @param  {array} list массив с рисками
         * @param  {boolean} included определяет какой именно это должен быть список, если true - значит застрахованные риски, 
         * @param  {object} baseRisk объект с данными о базовых рисках
         * @return {object}
         */
        const prepareListToPDF=({list, included, baseRisk})=>{
            const ul=[];
            if(included){
                if(baseRisk.included) ul.push(...baseRisk.ToPDF);
                for(const risk of list){
                    ul.push(
                        `${risk.name} - ${risk.title.toLowerCase()}. \n Относится к Перечню: ${risk.list.toString()}.\n`
                    )
                }
                return [
                    {
                        text: '1.0 Определения застрахованных рисков:\n',
                        decoration: 'underline',
                        fontSize:16,
                        pageBreak: 'before'
                    },
                    {
                        ul
                    }
                ]
            }
            else{
                if(!baseRisk.included) ul.push(...baseRisk.ToPDF);
                for(const risk of list){
                    ul.push(
                        `${risk.name} - ${risk.title.toLowerCase()}. `
                    )
                }
                return [
                    {
                        text: '1.1 Определения не заявленных на страхование рисков:\n',
                        decoration: 'underline',
                        fontSize:16
                    },
                    {
                        ul
                    }
                ]
            }
        }
        let content=[];
        
        /** 
         * После таблиц с номерами авто и рисками идет перечисление застрахованных и незастрахованных рисков 
         * Начинаем с базовых рисков
         * Если они включены(по умолчанию включены)
         */
        let baseRisk=Object.assign({},myFactory.polis.filter((paragraph)=>{
            return paragraph.name=="Базовые риски";
        })[0]);
        baseRisk.ToPDF=["Базовые риски:"];
        if(baseRisk.included){
            /**
             * если базовые риски включены - значит они в этом массиве не нужны, удаляем их 
             */
            risks=risks.filter(({name})=>{
                return name!=="Базовые риски";
            })
            /**
             * Сначала отбираем те параметры базовых рисков, которые включены, а затем делаем из них массив строк
             */
            baseRisk.values=baseRisk.values.filter(({checked})=>{
                return checked==true;
            }).map((value)=>{
                return value.text;
            });
            baseRisk.ToPDF.push(
                {
                    type: 'square',
                    ul: baseRisk.values
                }
            )
        }
        /**
         * Дальше перечисляем сначала те риски, которые застрахованы, а также к каким перечням(спискам) машин они относятся
         * Для начала раскидаем машины по спискам
         */
        let lists=this.makeCarLists(myFactory);
        /**
         * Затем определим, какие риски и куда входят
         */
        for(const risk of risks){
            risk.list=[];
            lists.forEach((list, i)=>{
                if (list.risks.includes(risk.name)) risk.list.push(i+1);
            });
        }
        /**
         * Остается лишь преобразовать профильтрованные данные в формат pdf
         */
        const includedRisks=risks.filter((risk)=>{
            return risk.list.length>0
        });
        content.push(...prepareListToPDF(
            {
                list: includedRisks, 
                included: true,
                baseRisk
            })
        );
        const notIncludedRisks=risks.filter((risk)=>{
            return risk.list.length==0
        })
        content.push(...prepareListToPDF(
            {
                list: notIncludedRisks, 
                included: false,
                baseRisk
            })
        );
        
        
        

        return content;
    }
    /**
     * Основная функция, создает на основе данных расчета и компании файл PDF и скачивает его
     * @param  {object} myFactory объект с практически всеми нужными данными
     * @param  {array} risks Список рисков с описанием
     */
    makePDF(myFactory, risks){
        console.log(myFactory.parks);
        let docDefinition = {
            content: [
                "\n\n\n\n\n\n",
                {
                    table: {
                        widths:[150, 150, 150],
                        body: [
                            [
                            
                                { 
                                    text: [
                                        "ПОЛИС CMR/ТТН - СТРАХОВАНИЯ ПЕРЕВОЗЧИКА \n", 
                                        "№ HIP-0000000-00-17"
                                    ],
                                    colSpan: 3,
                                    style: 'firstHeader' ,
                                    fontSize: 20,
                                },
                                {},
                                {}
                                
                                
                                    
                                
                            ],
                            [
                                {
                                    text: "Страхование действует в соответствии с Договором CMR/ТТН - страхования перевозчика № HIP-1000000-0-17.",
                                    colSpan: 3,
                                    fontSize: 7,
                                    alignment:'center'
                                },
                                {},
                                {}
                            ],
                            [
                                {
                                    text: "СТРАХОВЩИК",
                                    style: "leftCellFirstTable",
                                    margin:[0,20,0,0],
                                },
                                {
                                    text:[
                                        { 
                                            text:"ООО «СК «КАПИТАЛ-ПОЛИС»\n",
                                            bold: true,
                                        },
                                        {
                                            text:"Московский пр., д.22, лит. 3, Санкт-Петербург, 190013\n",
                                            fontSize: 10
                                        },
                                        {
                                            text:"Телефон: +7 (812) 322-63-51\n",
                                            fontSize: 10
                                        },
                                        {
                                            text:"E-mail: cargo@capitalpolis.ru, claims@capitalpolis.ru",
                                            fontSize: 10
                                        }
                                    ],
                                    colSpan: 2,
                                    alignment:'center'
                                },
                                {}
                            ],
                            [
                                {
                                    text: "ПЕРИОД СТРАХОВАНИЯ",
                                    style: "leftCellFirstTable"
                                    
                                },
                                {
                                    text:"00.00.2018 – 00.00.2019",
                                    alignment: 'center',
                                    bold: true,
                                    colSpan:2
                                }
                            ]
                        ],
                        style: 'table',
                    },
                    layout: {// цвет границы 
                        hLineColor: '#e6e6e6',
                        vLineColor: '#e6e6e6',
                    }
                },
                "\n",
                {
                    table: {
                        widths:[150, 150, 150],
                        body: [
                            [
                                {
                                    text: "СТРАХОВАТЕЛЬ",
                                    style: "leftCellFirstTable"
                                    
                                },
                                {
                                    text:[
                                        { 
                                            text:`${myFactory.newClientCard["Данные компании"]["Форма организации"]} ${myFactory.newClientCard["Данные компании"]["Наименование организации"]}\n`,
                                            bold: true,
                                        },
                                        { 
                                            text:"Большой Сампсониевский пр., 1, корп. 5, Санкт-Петербург, 190000",
                                            fontSize: 8,
                                        }
                                        
                                    ],
                                    colSpan: 2,
                                    alignment:'center'
                                },
                            ],
                            [
                                {
                                    text: "КОЛИЧЕСТВО\n ТРАНСПОРТНЫХ СРЕДСТВ",
                                    style: "leftCellFirstTable"
                                    
                                },
                                {
                                    text:`${myFactory.totalAmount / 24 } на 0.0.2018`,
                                    margin:[0,5,0,0],
                                    bold: true,
                                    colSpan: 2,
                                    alignment:'center'
                                },
                            ]
                        ]
                    },
                    layout: {// цвет границы 
                        hLineColor: '#e6e6e6',
                        vLineColor: '#e6e6e6',
                    }
                },
                "\n",
                {
                    table: {
                        widths:[150, 150, 150],
                        body: [
                            [
                                {
                                    text: "ТЕРРИТОРИЯ СТРАХОВАНИЯ",
                                    style: "leftCellFirstTable"
                                    
                                },
                                {
                                    text:"РОССИЯ, КАЗАХСТАН, БЕЛАРУСЬ",
                                    colSpan: 2,
                                    alignment:'center',
                                    bold: true,
                                },
                            ],
                            [
                                {
                                    text: "ЛИМИТ ОТВЕТСТВЕННОСТИ СТРАХОВЩИКА",
                                    style: "leftCellFirstTable"
                                    
                                },
                                {
                                    text:`${this.addSpaces(myFactory.a_limit.value)}`,
                                    margin:[0,5,0,0],
                                    bold: true,
                                    colSpan: 2,
                                    alignment:'center'
                                },
                            ],
                            [
                                {
                                    text: "АГРЕГАТНЫЙ ЛИМИТ ОТВЕТСТВЕННОСТИ СТРАХОВЩИКА",
                                    style: "leftCellFirstTable"
                                    
                                },
                                {
                                    text:`${this.addSpaces(myFactory.a_limit.value)}`,
                                    margin:[0,10,0,0],
                                    bold: true,
                                    colSpan: 2,
                                    alignment:'center'
                                },
                            ],
                            [
                                {
                                    text: "БЕЗУСЛОВНАЯ ФРАНШИЗА",
                                    style: "leftCellFirstTable"
                                    
                                },
                                {
                                    text:"НЕ ПРИМЕНЯЕТСЯ",
                                    bold: true,
                                    colSpan: 2,
                                    alignment:'center'
                                },
                            ],
                            [
                                {
                                    text: "ДАТА ВЫДАЧИ",
                                    style: "leftCellFirstTable"
                                    
                                },
                                {
                                    text:"00.00.2018",
                                    bold: true,
                                    colSpan: 2,
                                    alignment:'center'
                                },
                            ]
                        ]
                    },
                    layout: {// цвет границы 
                        hLineColor: '#e6e6e6',
                        vLineColor: '#e6e6e6',
                    }
                },
                "\n",
                {
                    table: {
                        widths:[100, 300, 50],
                        body: [
                            [
                            
                                { 
                                    text: "ПЕРЕЧЕНЬ ЗАСТРАХОВАННЫХ ГРУЗОВ",
                                    colSpan: 3,
                                    alignment: 'center',
                                    bold: true
                                },
                                {},
                                {}
                             
                            ],
                            
                            [
                                {
                                    text: "Любой и каждый груз с учетом исключений по пункту 2",
                                    style: "leftCellFirstTable",
                                    colSpan: 2,
                                    alignment: 'center',
                                    bold: true,
                                    margin:[0,5,0,0]
                                    
                                },
                                {},
                                {
                                    text:" НЕТ",
                                    margin:[0,5,0,0],
                                    alignment: 'center',
                                }
                            ],
                            [
                                {
                                    text: "Наличие перечня грузов, подпадающих под страхование",
                                    style: "leftCellFirstTable",
                                    colSpan:2,
                                    alignment: 'center',
                                    bold: true,
                                    margin:[0,5,0,0]
                                    
                                },
                                {},
                                {
                                    text:"ДА",
                                    margin:[0,5,0,0],
                                    alignment: 'center',
                                }
                            ]
                        ]
                    },
                    layout: {// цвет границы 
                        hLineColor: '#e6e6e6',
                        vLineColor: '#e6e6e6',
                    }
                },
                "\n",
                {
                    table: {
                        widths:[100, 300, 50],
                        body: [
                            
                            [
                                {
                                    text:[
                                        {
                                            text:"ООО «СК «КАПИТАЛ-ПОЛИС»\n",
                                            bold:true,
                                        },
                                        {
                                            text:"\n\n"
                                        },
                                        {
                                            text:"__________________________________________\n",
                                        },
                                        {
                                            text:"/Корпусов Д.В/\n",
                                            fontSize: 7
                                        },
                                        {
                                            text:"Доверенность №74/2018 от 10.03.2018\n",
                                            fontSize: 7
                                        },
                                        {
                                            text:"\n"
                                        }
                                    ],
                                    alignment:"center",
                                    colSpan:3
                                },
                                {},
                                {}
                            ]
                        ]
                    },
                    layout: {// цвет границы 
                        hLineColor: '#e6e6e6',
                        vLineColor: '#e6e6e6',
                    }
                },
                {
                    text:"\n",
                    pageBreak: 'after'
                },
            ],
            footer: function(page, pages) { 
                return { 
                    columns: [ 
                        
                        { 
                            alignment: 'center',
                            fontSize:6,
                            text: [
                                { 
                                    text:"Страница "+ page.toString(), 
                                    italics: true,
                                    
                                },
                                '/',
                                { 
                                    text: pages.toString()+" Полиса № HIP-0000000-00-17", 
                                    italics: true 
                                    
                                }
                            ]
                        }
                    ],
                    margin: [10, 0]
                };
            },
            styles: {
                leftCellFirstTable: {
                    italics: true,
                    fillColor: '#e6e6e6',
                    fontSize: 10,
                },
                table: {
                    fontStyle:"PT Sans Narrow",
                    alignment: 'center'
                },
                firstHeader: {
                    bold: true,
                    fillColor: '#e6e6e6',
                    alignment: 'center'
                }
            }
    
        };
        
        docDefinition.content.push(
            {
                text: "Под действия настоящего Полиса подпадают следующие Перечни транспортных средств, на закрепленных ниже условиях:"
            },
            "\n",
            ...this.makeTables(myFactory),
            {
                text: ' * - заполняется на усмотрение страхователя'
            },
            "\n",
            ...this.makeRisksList(myFactory, risks),
            ...this.makeParagraphs(myFactory),
            "\n",
            {
                table: {
                    widths:[230, 230],
                    body: [
                        
                        [
                            {
                                text:"СТРАХОВАТЕЛЬ:",
                                style:"firstHeader",
                                fontSize:12
                            },
                            {
                                text:"СТРАХОВЩИК:",
                                style:"firstHeader",
                                fontSize:12
                            }
                        ],
                        [
                            {
                                text:[
                                    {
                                        text:"ООО «..»\n",
                                        bold: true
                                    },
                                    {
                                        text:"\n\n\n"
                                    },
                                    {
                                        text:"__________________________________\n",
                                    },
                                    {
                                        text:`${myFactory.newClientCard["Данные компании"]["Форма организации"]} ${myFactory.newClientCard["Данные компании"]["Наименование организации"]}\n`,
                                        fontSize:7
                                    },
                                    {
                                        text:"На основании Устава",
                                        fontSize:7
                                    }
                                ],
                                alignment: "center"
                            },
                            {
                                text:[
                                    {
                                        text:"ООО «СК «КАПИТАЛ-ПОЛИС»\n",
                                        bold: true
                                    },
                                    {
                                        text:"\n\n\n"
                                    },
                                    {
                                        text:"__________________________________\n",
                                    },
                                    {
                                        text:"/Корпусов Д.В./\n",
                                        fontSize:7
                                    },
                                    {
                                        text:"Доверенность №74/2018 от 10.03.2018",
                                        fontSize:7
                                    }
                                ],
                                alignment: "center"
                            },
                        ]
                    ]
                },
                layout: {// цвет границы 
                    hLineColor: '#e6e6e6',
                    vLineColor: '#e6e6e6',
                }
            }
        )
    
    
    
    
    
        
        //pdfMake.createPdf(docDefinition).open();
        //pdfMake.createPdf(docDefinition).print();
        pdfMake.createPdf(docDefinition).download('optionalName.pdf');
    }
}
const polis = new PolisMaker();



