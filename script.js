const pEl = document.querySelector('.dis');
const btn = document.querySelector('.btn');
const pHis = document.querySelector('.his');
const loader = document.querySelector('.loader');
let v = 0;
let valData = [];
let refData = [];

let firebaseConfig = {
  apiKey: 'AIzaSyDediRW42hoEn06uJ1h6dg-a_cVxQTKVRU',
  authDomain: 'notesapp-937b7.firebaseapp.com',
  databaseURL: 'https://notesapp-937b7.firebaseio.com',
  projectId: 'notesapp-937b7',
  storageBucket: 'notesapp-937b7.appspot.com',
  messagingSenderId: '608097274197',
  appId: '1:608097274197:web:1ee431040b319a36aac7dc'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.database();
let ref = db.ref('scores');

ref.on('value', getData, errData);

window.onload = () => {
  loader.style.display = 'block';
  setTimeout(() => {
    loader.style.display = 'none';
  }, 900);
};

function render() {
  pHis.innerHTML = '';

  valData.forEach(item => {
    // console.log(item);
    const liEl = document.createElement('p');
    liEl.classList.add('lii');
    liEl.setAttribute('data-set', `${item.id}`);
    liEl.innerHTML = `score: ${item.score} <i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i>`;
    pHis.appendChild(liEl);

    const editEl = liEl.querySelector('.fa-edit');
    editEl.addEventListener('click', handleEdit);

    const delEl = liEl.querySelector('.fa-trash-alt');
    delEl.addEventListener('click', handleDel);
  });
}

function handleEdit(e) {
  const editId = parseInt(e.target.parentElement.dataset.set);
  const inpEl = document.createElement('input');
  inpEl.setAttribute('type', 'number');
  inpEl.classList.add('inp');
  const liElement = pHis.querySelector(`.lii[data-set="${editId}"]`);

  inpEl.value = valData.find(item => {
    return item.id === editId;
  }).score;

  liElement.replaceWith(inpEl);

  inpEl.addEventListener('blur', e => {
    // console.log(e.target.value);
    valData.map(item => {
      if (item.id === editId) {
        item.score = inpEl.value;
      }
      return item;
    });
    const fireRef = refData.find(item => {
      return item[1].id === editId;
    });

    console.log(fireRef);
    let newEditValue = inpEl.value;
    console.log(newEditValue);

    db.ref('scores/' + fireRef[0]).set({
      id: new Date().getTime(),
      score: newEditValue
    });
  });
}

function handleDel(e) {
  const delId = parseInt(e.target.parentElement.dataset.set);
  // e.target.parentElement.remove();
  const delIndex = valData.findIndex(item => {
    return item.id === delId;
  });
  // Getting Firebase key..
  const fireRef = refData.find(item => {
    return item[1].id === delId;
  });
  console.log(fireRef);
  let delFire = db.ref('scores/' + fireRef[0]);
  valData.splice(delIndex, 1);
  render(valData);
  delFire.remove();
}

function getData(data) {
  refData = Object.entries(data.val());
  valData = Object.values(data.val());
  render(valData);
}

function errData(err) {
  console.log('sdsdsdsd');
  console.log(err, 'error');
}

btn.addEventListener('click', e => {
  v++;
  ref.push({
    id: new Date().getTime(),
    score: v
  });
  pEl.textContent = `${v}`;
});
