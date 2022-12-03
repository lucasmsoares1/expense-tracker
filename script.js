const transactionsList = document.querySelector('#transactions')
const form = document.querySelector('#form')
const titleInput = document.querySelector('#text')
const amountInput = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const addTransactionIntoDOM = (transaction) => {
  const { id, title, amount } = transaction

  //Using classes to define the LI border color
  const transactionClass = amount < 0 ? 'minus' : 'plus'
  const transactionOperator = amount < 0 ? '-' : '+'
  const amountWithoutOperator = Math.abs(amount)

  //Building the LI and appending in transactions list
  const item = document.createElement('li')
  item.classList.add(transactionClass)
  item.innerHTML =  `
    ${title}
    <span>
        ${transactionOperator}
        R$ ${amountWithoutOperator}
    </span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `

  transactionsList.append(item) 
}

const updateBalances = () => {
  const transactionsAmounts = transactions.reduce((acc, { amount }) => {
    if(amount > 0){
      acc.incomes += Number(amount)
      acc.total += Number(amount)
    
    } else {
      acc.expenses += Number(amount)
      acc.total -= Number(amount)
    }

    return acc
  }, 
  {
    total: 0,
    incomes: 0,
    expenses: 0
  })
  document.querySelector("#balance").innerHTML = `R$ ${transactionsAmounts.total.toFixed(2)}`
    document.querySelector("#money-plus").innerHTML = `R$ ${transactionsAmounts.incomes.toFixed(2)}`
  document.querySelector("#money-minus").innerHTML = `R$ ${transactionsAmounts.expenses.toFixed(2)}`
}

const removeTransaction = (ID) => {
  transactions = transactions.filter(transaction => transaction.id !== ID)
  updateApp()
  updateLocalStorage()
}

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const addTransactionIntoArray = (title, amount) => {
  transactions.push({
    id: Date.now(),
    title,
    amount
  })
}

const submitFormHandler = e => {
  e.preventDefault()
  
  const transactionTitle = titleInput.value.trim()
  const transactionAmount = amountInput.value.trim()
  const isSomeInputEmpty = !transactionTitle || !transactionAmount

  if (isSomeInputEmpty) {
    alert('Preencha os campos')
    return
  }

  addTransactionIntoArray(transactionTitle, transactionAmount)
  updateApp()
  updateLocalStorage()

  e.target.reset()
}

form.addEventListener('submit', submitFormHandler)

const updateApp = () => {
  transactionsList.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM);
  updateBalances()
}

updateApp()
