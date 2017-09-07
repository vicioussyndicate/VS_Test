

function createPowerRanking () {

    var nrPower = 5
    var ranks = range(0,hsRanks)
    ranks[0] = 'L'

    var columnTemplate = '1fr '
    for (var i=0;i<nrPower;i++) {columnTemplate += '4fr 1fr '}

    var el = document.getElementById('powerGrid')
    el.style.gridTemplateColumns = columnTemplate
    el.style.gridTemplateRows = 'auto'


    var innerHtml = '<div class="header" >Rank</div>'

    //Header
    for (var i=0;i<nrPower;i++) {
        innerHtml += `<div class="header columnTitle">Top ${i+1}</div>`
    }


    for (var i=0;i<hsRanks;i++) {
        innerHtml += `<div class="pivot" style="">${ranks[i]}</div>`

        for (var j=0;j<nrPower;j++) {
            var hsArch = "Token Druid"
            innerHtml += `<button title='${hsArch}' onclick="clickbutton('${hsArch}')" style="background-color: ${randomColor()};" class="archBtn">Token Druid</button>`
            innerHtml += `<div class="winrate">${randint(45,60)}%</div>`
        }
    }
    el.innerHTML = innerHtml
}

function clickbutton (e) {
    toggleMainTabs({target:document.querySelector('#decks.tab')})
}
