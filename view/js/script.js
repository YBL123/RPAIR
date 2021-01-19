import axios from 'axios'

const userOption = document.getElementById('user-select')
const showButton = document.getElementById('submit-btn')
showButton.disabled = true
showButton.classList.add('disabled')


userOption.addEventListener('change', (e) => {
  if (e.target.value !== '-1' ) {
    showButton.classList.remove('disabled')
  }
  const user = e.target.options[e.target.selectedIndex].text
  return user
})

const getUserStatement = async () => {
  try {
    const res = await axios.get('https://jsonmock.hackerrank.com/api/transactions?userId=John Oliver')
    console.log(res.data)
  } catch (err) {
    console.log(err)
  }
}

showButton.addEventListener('submit', () => {
  getUserStatement()
} )

