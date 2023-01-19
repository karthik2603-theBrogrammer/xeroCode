import bot from './assets/rickroll.jpeg';
import user from './assets/human.png';
// import rickRoll from '../client/rickroll.mp3';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
// const rickRoll = new Audio(rickRoll);

let loadInterval;
function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContext === '....') {
      element.textContent = ' ';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
            <div class="wrapper ${isAi && 'ai'}">
                <div class="chat">
                    <div class = "profile">
                        <img src="${isAi ? bot : user}" alt="${
    isAi ? 'bot' : 'user'
  }"/>
                    </div>
                    <div class="message" id=${uniqueId}>${value}</div>
                </div>
            </div>
        `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  //user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // fetch the data from the server
  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';
  if (response.ok) {
    // console.log(response, typeof response);
    const data = await response.json();
    // console.log(data);
    const parsedData = data.bot.trim();
    // console.log(parsedData);
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = 'Something Went Wrong';
    alert(err);
  }
};

document.getElementById('submit').addEventListener('click', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
