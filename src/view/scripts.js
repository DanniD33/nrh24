document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signupForm');
  const signinForm = document.getElementById('signinForm');

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Basic validation
      if (name && email && password) {
        console.log('Signing up with', { name, email, password });
        alert('Sign-up successful!');
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        window.location.href = 'profile.html';
      } else {
        alert('Please fill in all fields.');
      }
    });
  }

  if (signinForm) {
    signinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('signinUsername').value;
      const password = document.getElementById('signinPassword').value;

      // Basic validation
      if (username && password) {
        console.log('Signing in with', { username, password });
        alert('Sign-in successful!');
        window.location.href = 'profile.html';
      } else {
        alert('Please fill in all fields.');
      }
    });
  }

  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const logoutButton = document.getElementById('logoutButton');

  if (profileName && profileEmail) {
    profileName.textContent = localStorage.getItem('name');
    profileEmail.textContent = localStorage.getItem('email');

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(addMessageToChat);

    chatForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        addMessageToChat('You: ' + message);
        messages.push('You: ' + message);

        const botResponse = await getAIResponse(message);
        addMessageToChat(botResponse);
        messages.push(botResponse);
        localStorage.setItem('messages', JSON.stringify(messages));

        chatInput.value = '';
      }
    });

    logoutButton.addEventListener('click', function () {
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('messages');
      window.location.href = 'index.html';
    });
  }

  function addMessageToChat(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function getAIResponse(userMessage) {
    const response = await fetch(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: userMessage }],
          max_tokens: 150,
        }),
      }
    );
    const data = await response.json();
    return 'AI: ' + data.choices[0].message.content.trim();
  }
});
