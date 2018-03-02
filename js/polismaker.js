const makePDF=(myFactory, risks)=>{
    const paragraphs=[];
    myFactory.polis.forEach((obj,i)=>{
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
    console.log(paragraphs);
    
    let ul=[];
    console.log(risks);
    risks.forEach((risk)=>{
        // let string="";
        // string+=risk.name;
        // string+=" - ";
        // if(risk.name!=="Базовые риски") string+=risk.title.toLowerCase();
        // else string+="согласно п. 1."
        // string+="\n";
        
        // if(risk.name==="Базовые риски"){
        //     string+="Относится ко всем спискам.";
        // }
        // else{
        //     let include="Включает: ";
        //     let notInclude="Не влючает: ";
        //     myFactory.parks.forEach(({risks}, i)=>{
        //         if(risks.includes(risk.name)){
        //             include+=`список ${i+1}`;
        //         }
        //         else{
        //             notInclude+=`список ${i+1}`;
        //         }
        //     });
        //     if(include==="Включает: "){
        //         string+="Не относится ни к одному списку.";
        //     }
        //     else if(notInclude==="Не влючает: "){
        //         string+="Относится ко всем спискам.";
        //     }
        //     else{
        //         string+=include;
        //         string+="\n";
        //         string+=notInclude;

        //     }
        // }
        // string+="\n";
        

    })
    string="Базовые риски - согласно п. 1. \n Относится к сп. 1. \n";
    ul.push(string);
    string="Таможенные платежи - расходы страхователя, связанные с обязанностью по уплате(возмещению) таможенных платежей. \n Относится к сп. 1. \n";
    ul.push(string);
    string="Повреждение контейнера - утрата, гибель или повреждение контейнера, не принадлежащего страхователю, а также расходы по подъему и вытаскиванию контейнера\n Относится к сп. 2. \n";
    ul.push(string);
    string="Повреждение товарных автомобилей - повреждения перевозимых товарных автомобилей при отсутствии дтп в виде царапин, вмятин, сколов лкп кузова или колесных дисков, бой стекол и зеркал в пределах 10% от стоимости товарного автомобиля\n Относится к сп. 3.\n";
    ul.push(string);
    let notInclude=[];
    notInclude.push("Погрузка, разгрузка - повреждение или гибель всего или части груза, наступившие в ходе погрузо-разгрузочных работ, если эти работы осуществлялись или были организованы Страхователем");
    notInclude.push("Поломка реф. установки - гибель, порча или понижение качества (сортности) груза в результате случайной поломки холодильной установки, приведшей к ее непрерывной остановке на срок не менее 24 часов");
    notInclude.push("Повреждение товарных автомобилей - повреждения перевозимых товарных автомобилей при отсутствии ДТП в виде царапин, вмятин, сколов ЛКП кузова или колесных дисков, бой стекол и зеркал в пределах 10% от стоимости товарного автомобиля");
    notInclude.push("Противоправные действия третьих лиц - гибель или повреждение груза в результате противоправных действий третьих лиц");
    notInclude.push("Промежуточное хранение - гибель, повреждение или кража груза во время его промежуточного хранения, организованного Страхователем");
    notInclude.push("Неохраняемая стоянка - утрата части груза в результате кражи с неохраняемой стоянки");
    console.log(ul);
    console.log(notInclude);
    let body=[];
    
    const lists=[];
    myFactory.parks.forEach((park, parkNumber)=>{
        
        park.processes.forEach((process, i)=>{
            /**
             * Функция проверки двух соседних строк на идентичность машин, к которым относятся данные строки
             * @param  {array} mass1
             * @param  {array} mass2
             * @return {boolean} возвращает true, если машины идентичны
             */
            const areEquivalent = (mass1, mass2)=>{
                if (mass1.length!==mass2.length) return false;
                for(car of mass1){
                    if(!mass2.includes(car)) return false;
                }
                return true;
            }
            // if(i+1==park.processes.length || !areEquivalent(park.processes[i]["cars"],park.processes[i+1]["cars"])){
            //     body.push([{
            //         text:`Список ${listCount}`,
            //         colSpan: 6,
            //         alignment:'left',
            //         border: [false, false, false, false]
            //     }]);
            //     process.cars.forEach(car=>{
            //         body.push([{
            //             text:car
            //         },"","","","0.0.2018","0.0.2019"])
            //     })
            //     listCount++;
            // }


            if(i==0 || !areEquivalent(park.processes[i]["cars"],park.processes[i-1]["cars"]) ){
                lists.push(
                    {
                        cars: park.processes[i]["cars"],
                        processes: [park.processes[i]]
                    }
                )
            }
            else{
                lists[lists.length-1].processes.push(park.processes[i]);
            }

            // let row=[];
            // if(i==0){
            //     row=[addSpaces(process.cost)];
            //     if(myFactory.amountType=="Тягачей"){
            //         row.push(process.amount/24+` ${myFactory.amountType}`);
            //     }
            //     else row.push(process.amount+` ${myFactory.amountType}`);
            //     row.push(process.wrapping, process.risk, addSpaces(process.limit), process.franchise);
            // }
            // else{
            //     let properties=["cost", "amount", "wrapping", "risk", "limit", "franchise"];
            //     properties.forEach((property)=>{
            //         if(property=="amount"){
            //             if(myFactory.amountType=="Тягачей"){
            //                 if(process[property]===park.processes[i-1][property]) row.push({text:process[property]/24+` ${myFactory.amountType}`, color: "#bdb6b6"});
            //                 else row.push(process[property]/24+` ${myFactory.amountType}`);
            //             }
            //             else{
            //                 if(process[property]===park.processes[i-1][property]) row.push({text:process[property]+` ${myFactory.amountType}`, color: "#bdb6b6"});
            //                 else row.push(process[property]+` ${myFactory.amountType}`);
            //             }
            //         }
            //         else if(property=="cost" || property=="limit"){
            //             if(process[property]===park.processes[i-1][property]) row.push({text:addSpaces(process[property]), color: "#bdb6b6"});
            //             else row.push(addSpaces(process[property]));
            //         }
            //         else{
            //             if(process[property]===park.processes[i-1][property]) row.push({text:process[property], color: "#bdb6b6"});
            //             else row.push(process[property]);
            //         }

            //     })
            // }
            // body.push(row);
            
            
        });
    });
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
                            text:`Объем перевозок, ${myFactory.amountType}`,
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
                    row.push(addSpaces(process[property]));
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
                            text:'Номер машины', 
                            style:"firstHeader",
                        },
                        {
                            text:`VIN*`,
                            style:"firstHeader", 
                        },
                        {
                            text:'Год выпуска*', 
                            style:"firstHeader",
                        },
                        {
                            text:'Стаж*', 
                            style:"firstHeader",
                        },
                        {
                            text:'Включена с', 
                            style:"firstHeader",
                        },
                        {
                            text:'Включена по',
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
                        text:car
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
                                text:3,
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
                                text:`${addSpaces(myFactory.a_limit.value)}`,
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
                                text:`${addSpaces(myFactory.a_limit.value)}`,
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
                                text: "ТОЛЬКО ПЕРЕЧИСЛЕННЫЕ ГРУЗЫ: ",
                                style: "leftCellFirstTable"
                                
                            },
                            {
                                text:"------",
                                margin:[0,10,0,0],
                                style: "leftCellFirstTable",
                                alignment: 'center',
                                bold: true,
                            },
                            {
                                text:" НЕТ",
                                margin:[0,10,0,0],
                                alignment: 'center',
                            }
                        ],
                        [
                            {
                                text: [
                                    {
                                        text:"ТОЛЬКО ПЕРЕЧИСЛЕННЫЕ ГРУЗЫ:\n ",
                                    },
                                    {
                                        text:"грузов, принятых к перевозке в поврежденном состоянии; наливных и насыпных грузов; взрывчатых веществ; кинопленки и киноленты; стекло и стеклянно-фарфоровых изделий без специальной упаковки; банкнот и монет; драгоценных камней, драгоценных металлов и изделий из них; ювелирных изделий; художественных изделий и антиквариата; предметов искусства; живых организмов любых видов; товаров военного и двойного назначения.",
                                        fontSize:9,
                                    }
                                ],
                                style: "leftCellFirstTable",
                                colSpan:2,
                                
                            },
                            {},
                            {
                                text:"ДА",
                                margin:[0,25,0,0],
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
        text: "Под действия настоящего Полиса подпадают следующие перечни транспортных средств, на закрепленных ниже условиях:"
    },
    "\n",
    ...listContent,
    {
        text: ' * - заполняется на усмотрение страхователя'
    },
    "\n",
    {
        text: 'Определения застрахованных рисков:\n',
        fontSize:16,
        pageBreak: 'before'
    }, 
    {
        ul
    },
    {
        text: 'Определения не заявленных на страхование рисков:\n',
        fontSize:16
    },
    {
        ul: notInclude
    });
    docDefinition.content.push(...paragraphs);
    docDefinition.content.push("\n",
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
    })





    
    //pdfMake.createPdf(docDefinition).open();
    //pdfMake.createPdf(docDefinition).print();
    pdfMake.createPdf(docDefinition).download('optionalName.pdf');
};
function addSpaces(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
}