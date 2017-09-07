

function createPowerRanking () {

    var nrPower = 6
    var ranks = range(0,hsRanks)
    ranks[0] = 'L'

    var columnTemplate = '1fr '
    for (var i=0;i<nrPower;i++) {columnTemplate += '4fr 1fr '}

    var el = document.getElementById('powerGrid')
    el.style.gridTemplateColumns = columnTemplate
    el.style.gridTemplateRows = 'auto'


    var innerHtml = '<div style="background-color: grey; padding: 0.2rem;">Rank</div>'

    //Header
    for (var i=0;i<nrPower;i++) {
        innerHtml += `<div style="grid-column-end: span 2; background-color: grey; padding: 0.2rem;">Top ${i+1}</div>`
    }


    for (var i=0;i<hsRanks;i++) {
        innerHtml += `<div style="background-color: grey; padding: 0.2rem;">${ranks[i]}</div>`

        for (var j=0;j<nrPower;j++) {
            innerHtml += `<div style="background-color: ${randomColor()}; padding: 0.2rem;">Token Druid</div>`
            innerHtml += `<div style="padding: 0.2rem;">${randint(45,60)}%</div>`
        }
    }
    el.innerHTML = innerHtml
}


