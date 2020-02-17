const card = note => {
  return `
  <div class="card">
      <div class="card-body">
          <span class="card-title">${note.title}</span>
          <p style="white-space: pre-line;" class="card-text">${note.text}</p>
          <small>${new Date(note.date).toLocaleDateString()}</small>
      </div>
      <div>
          <button class="note-delete btn btn-primary" data-id="${note._id}">delete</button>
      </div>
  </div>
  `
};

let userId = '';
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
    return fetch(`${BASE_URL}/notes/new`, {
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

  static delete(ids) {
    return fetch(`${BASE_URL}/notes/delete`, {
      method: 'post',
      body: JSON.stringify(ids),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(res => res.json())
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#notes').addEventListener('click', onDeleteNote);
});

function renderNotes(_notes = []) {
  const $notes = document.querySelector('#notes');
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
        changeWorkflow(answer);
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
        changeWorkflow(answer)
      }
    });
  }
}

function onDeleteUser() {
  if (confirm('Are you sure?')) {
     UserApi.delete(userId).then((answer) => {
       alert(answer.message);
       userId = '';
       document.getElementById('auth-form').style.display="block";
       document.getElementById('note-form').style.display="none";
       document.getElementById('notes').style.display="none";
     })
  }
}

function onCreateNote() {
  const $title = document.querySelector('#title');
  const $text = document.querySelector('#text');

  if ($title.value && $text.value) {
    const newNote = {
      title: $title.value,
      text: $text.value,
      id: userId
    };

    NoteApi.create(newNote).then(answer => {
      if ('message' in answer) {
        alert(answer.message);
      } else {
        renderNotes(answer.notes);
      }
    });
    $title.value = '';
    $text.value = '';
  }
}

function onDeleteNote(event) {
  if(event.target.classList.contains('note-delete')) {
    let id = event.target.getAttribute('data-id');
    let ids = {
      id: id,
      userId: userId
    };
    NoteApi.delete(ids).then(answer => {
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

function changeWorkflow(user) {
  renderNotes(user.notes);
  getUserId(user._id);
  document.getElementById('auth-form').style.display="none";
  document.getElementById('note-form').style.display="block";
  document.getElementById('notes').style.display="block";
}