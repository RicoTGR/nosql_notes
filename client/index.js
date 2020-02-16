const card = note => {
  return `
  <div>
      <div>
          <span>${note.title}</span>
          <p style="white-space: pre-line;">${note.text}</p>
          <small>${new Date(note.date).toLocaleDateString()}</small>
      </div>
      <div>
          <button class="note-delete" data-id="${note._id}">delete</button>
      </div>
  </div>
  `
};

const $notes = document.querySelector('#notes');
const BASE_URL = '/api';

class UserApi {
  static auth(user) {
    return fetch(`${BASE_URL}/auth`, {
      method: 'post',
      body: JSON.stringify(user),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }

  static reg(user) {
    return fetch(`${BASE_URL}/reg`, {
      method: 'post',
      body: JSON.stringify(user),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }

  static delete(id) {
    return fetch(`${BASE_URL}/${id}`, {
      method: 'delete'
    }).then(res => res.json())
  }
}

class NoteApi {
  static create(note) {
    return fetch(`${BASE_URL}/new`, {
      method: 'post',
      body: JSON.stringify(note),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }

  static edit(note) {
    return fetch(`${BASE_URL}/notes/edit`, {
      method: 'post',
      body: JSON.stringify(note),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }

  static delete(id, userId) {
    return fetch(`${BASE_URL}/notes/delete/${id}`, {
      method: 'post',
      body: JSON.stringify(userId),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }
}

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('#createNote').addEventListener('click', onCreateNote);
  document.querySelector('#notes').addEventListener('click', onDeleteNote);
});

function renderNotes(_notes = []) {

  if (_notes.length > 0) {
    $notes.innerHTML = _notes.map(note => card(note)).join(' ')
  } else {
    $notes.innerHTML = `<div class="center">There are no notes yet</div>`
  }
}


function onAuthUser() {
  const $login = document.querySelector('#login');
  const $password = document.querySelector('#password');

  if ($login.value && $password.value) {
    const newUser = {
      login: $login.value,
      password: $password.value
    };

    UserApi.auth(newUser).then(answer => {
      if('message' in answer) {
        alert(answer.message);
      } else {
        onClear();
        getUserId(answer._id);
        window.location.href="notes.html";
      }
    });
  }
}

function onRegUser() {
  const $login = document.querySelector('#login');
  const $password = document.querySelector('#password');

  if ($login.value && $password.value) {
    const newUser = {
      login: $login.value,
      password: $password.value
    };

    UserApi.reg(newUser).then(answer => {
      if ('message' in answer) {
        alert(answer.message);
      } else {
        getUserId(answer._id);
        window.location.href="notes.html";
      }
    });
  }
}

function onDeleteUser() {
  if (confirm('Are you sure?')) {
     UserApi.delete(userId).then((answer) => {
       alert(answer.message);
       userId = '';
       window.location.href="index.html";
     })
  }
}

function onCreateNote() {
  const $title = document.querySelector('#title');
  const $text = document.querySelector('#text');

  if ($title.value && $text.value) {
    const newNote = {
      login: $title.value,
      password: $text.value,
      id: userId
    };

    NoteApi.create(newNote).then(answer => {
      if ('message' in answer) {
        alert(answer.message);
      } else {
        renderNotes(answer.notes);
      }
    });
  }
}

function onDeleteNote(event) {
  if(event.target.classList.contains('note-delete')) {
    let id = event.getAttribute('note-id');
    NoteApi.delete(id, userId).then(answer => {
      renderNotes(answer.notes);
    })
  }
}

function onClear() {
  document.getElementsByName('login').value = '';
  document.getElementsByName('password').value = '';
}

function getUserId(id) {
  userId = id;
}