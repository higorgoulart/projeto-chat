// Feito por Higor e Guilherme Savio

const screen = $('#screen');
const body = document.body;
const message = document.getElementById('message');
const apiKey = '';

message.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') buttonOnClick(); 
});

function toggleMode() {
    body.classList.toggle('dark-mode');
}

function buttonOnClick() {
    let msg = message.value;
    
    sendMessage(msg);

    if (msg === '') return;

    getAnswer(msg);

    message.value = '';
}

function sendMessage(msg) {
    let msgSent = `
        <div class="me">
            <div class="msg-user">Você diz:</div>
            ${msg === ''
                ? '<div class="msg-sent">Feito por Higor e Guilherme Savio</div>' 
                : `<div class="msg-sent">${msg}</div>`}
        </div>`;

    screen.append(msgSent);
    scrollDown();
}

function getAnswer(msg) {
    let answer = $(`
        <div class="you">
            <div class="msg-user">Atendente diz:</div>
            <div class="msg-sent">...</div>
        </div>`);

    screen.append(answer);
    scrollDown();

    if (apiKey === '') {
        changeMessage(answer, 'Coloque a chave da API do ChatGPT na constante "apiKey"!');
        return;
    }

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            model: 'gpt-3.5-turbo', 
            messages: [ { role: 'user', content: msg } ] })
        })
        .then(response => response.json())
        .then(data => {
            changeMessage(answer, data.choices[0].message.content);
            scrollDown();
        })
        .catch(error => {
            console.error(error);
            message.remove()
        });
}

function scrollDown() {
    screen.animate({ scrollTop: body.scrollHeight });
}

function changeMessage(element, message) {
    element.children('.msg-sent').html(message);
}