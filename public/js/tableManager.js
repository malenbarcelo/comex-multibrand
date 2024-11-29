export class TableManager {
    constructor(tbodyId) {
        this.tbody = document.getElementById(tbodyId)
    }

    // add row
    addRow(data,index) {
        const row = document.createElement('tr')
        
        data.forEach(cellData => {
            const cell = document.createElement('td')
            if (index % 2 === 0) {
                cell.classList.add('tBody1', 'tBodyEven');  
            } else {
                cell.classList.add('tBody1', 'tBodyOdd');   
            }
            cell.textContent = cellData
            row.appendChild(cell)
        })

        //add icons
        const editCell = document.createElement('td')
        if (index % 2 === 0) {
            editCell.classList.add('tBody1', 'tBodyEven');  
        } else {
            editCell.classList.add('tBody1', 'tBodyOdd');   
        }
        const editIcon = document.createElement('i')
        editIcon.classList.add('fa-regular', 'fa-pen-to-square')
        editCell.appendChild(editIcon)
        row.appendChild(editCell)

        //add row to tBody
        this.tbody.appendChild(row)
    }

    //add multiple rows
    loadTable(dataArray) {
        this.clearTable()  // clean table

        dataArray.forEach((data,index) => {
            this.addRow(data,index)
        })
    }

    //clean table
    clearTable() {
        this.tbody.innerHTML = ''
    }
}