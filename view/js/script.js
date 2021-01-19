const userOption = document.getElementById('user-select')
const monthlyStatements = document.getElementById('monthly-statements')
const userBalance = document.getElementById('user-balance')
const userName = document.getElementById('user-name')
const showButton = document.getElementById('submit-btn')
showButton.disabled = true
showButton.classList.add('disabled')
const loader = document.getElementById('loader-view')
loader.style.display = 'none'


let userId = 1

userOption.addEventListener('change', (e) => {
  if (e.target.value !== '-1') {
    showButton.classList.remove('disabled')
    showButton.disabled = false
  }
  userId = e.target.options[e.target.selectedIndex].value
})

const getUserStatement = async (ID) => {
  loader.style.display = 'block'
  const res = await fetch(`https://jsonmock.hackerrank.com/api/transactions?userId=${ID}`)
  if (res.status === 200) {
    loader.style.display = 'none'
  }
  return res.json()
}

const check = async () => {
  const statement = await getUserStatement(userId)
  console.log(statement.data)

  const balance = balanceCalculator(statement.data)
  userName.innerHTML = statement.data[0].userName
  userBalance.innerHTML = `Balance: $${balance}`

  monthlyStatements.innerHTML = ''

  const sortedStatements = printMonthlyStatements(statement.data)
  for (i = 0; i < sortedStatements.length; i++) {
    if (sortedStatements[i].balance !== 0) {
      let statementCardDiv = document.createElement('div')
      statementCardDiv.className = 'statement-card'

      let monthlyBalance = document.createElement('div')
      monthlyBalance.className = 'monthly-balance'
      monthlyBalance.innerHTML = `$${sortedStatements[i].balance.toFixed(2)}`
      statementCardDiv.appendChild(monthlyBalance)

      let monthYearDiv = document.createElement('div')
      monthYearDiv.className = 'month-year'
      monthYearDiv.innerHTML = sortedStatements[i].date
      statementCardDiv.appendChild(monthYearDiv)

      let creditDiv = document.createElement('div')
      creditDiv.className = 'monthly-credit'
      creditDiv.innerHTML = `Credit: $${sortedStatements[i].credit.toFixed(2)}`
      statementCardDiv.appendChild(creditDiv)

      let debitDiv = document.createElement('div')
      debitDiv.className = 'monthly-debit'
      debitDiv.innerHTML = `Debit: $${sortedStatements[i].debit.toFixed(2)}`
      statementCardDiv.appendChild(debitDiv)

      monthlyStatements.appendChild(statementCardDiv)
    }
  }
}

const printMonthlyStatements = (data) => {
  const sortedStatements = new Array(11).fill({})
  let currentMonth = 0
  for (let i = 0; i < 12; i++) {
    let monthlyStatement = {
      credit: 0,
      debit: 0,
      date: `${currentMonth + 1}/2019`,
      balance: 0
    }
    for (let ii = 0; ii < data.length; ii++) {
      const unixTimestamp = data[ii].timestamp
      const date = new Date(unixTimestamp * 1000)
      if (date.getMonth() === currentMonth) {
        let amount = data[ii].amount.replace('$', '')
        amount = parseFloat(amount.replace(/,/g, ''))
        if (data[ii].txnType === 'debit') {
          monthlyStatement.debit = amount + monthlyStatement.debit
          monthlyStatement.balance = monthlyStatement.balance - amount
        } else if (data[ii].txnType === 'credit') {
          monthlyStatement.credit = amount + monthlyStatement.credit
          monthlyStatement.balance = monthlyStatement.balance + amount
        }

      }
    }
    sortedStatements[currentMonth] = monthlyStatement
    currentMonth++
  }
  console.log(sortedStatements)
  return sortedStatements
}

const balanceCalculator = (data) => {
  let balance = 0
  for (let i = 0; i < data.length; i++) {
    let amount = data[i].amount.replace('$', '')
    amount = parseFloat(amount.replace(/,/g, ''))
    if (data[i].txnType === 'debit') {
      balance = balance - amount
    } else if (data[i].txnType === 'credit') {
      balance = balance + amount
    }
  }
  return balance.toFixed(2)
}

showButton.addEventListener('click', check)





