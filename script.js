const firebaseConfig = {
  apiKey: "AIzaSyAmbzRxqYFti6IEksy2WunKCVa_v8Gg0F0",
  authDomain: "market-digital-3d10e.firebaseapp.com",
  projectId: "market-digital-3d10e",
  storageBucket: "market-digital-3d10e.firebasestorage.app",
  messagingSenderId: "368580098929",
  appId: "1:368580098929:web:7e005211ceb83b3b9794d0",
  measurementId: "G-Q985QSMDDT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 1. ระบบลงประกาศสินค้า
document.getElementById('btnPost').addEventListener('click', () => {
    const data = {
        name: document.getElementById('itemName').value,
        price: Number(document.getElementById('itemPrice').value),
        category: document.getElementById('itemCategory').value,
        detail: document.getElementById('itemDetail').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if(data.name && data.price) {
        db.collection("products").add(data).then(() => alert("ประกาศขายสำเร็จ!"));
    }
});

// 2. ดึงรายการสินค้ามาแสดง
db.collection("products").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    const list = document.getElementById('marketList');
    list.innerHTML = '';
    snapshot.forEach(doc => {
        const item = doc.data();
        list.innerHTML += `
            <div class="product-card">
                <small>${item.category}</small>
                <h4>${item.name}</h4>
                <p>ราคา: <b>${item.price}.-</b></p>
                <button onclick="openChat('${doc.id}', '${item.name}')">💬 ติดต่อ</button>
            </div>
        `;
    });
});

// 3. ระบบแ chat
let currentChatId = "";

function openChat(productId, productName) {
    currentChatId = productId;
    document.getElementById('chatSection').style.display = 'flex';
    document.getElementById('chatWith').innerText = "คุยเรื่อง: " + productName;
    loadMessages(productId);
}

function loadMessages(id) {
    db.collection("chats").doc(id).collection("messages").orderBy("time")
    .onSnapshot(snapshot => {
        const box = document.getElementById('chatMessages');
        box.innerHTML = '';
        snapshot.forEach(m => {
            const msg = m.data();
            box.innerHTML += `<div><b>Student:</b> ${msg.text}</div>`;
        });
        box.scrollTop = box.scrollHeight;
    });
}

document.getElementById('btnSend').addEventListener('click', () => {
    const text = document.getElementById('msgText').value;
    if(text && currentChatId) {
        db.collection("chats").doc(currentChatId).collection("messages").add({
            text: text,
            time: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('msgText').value = '';
    }
});

function closeChat() { document.getElementById('chatSection').style.display = 'none'; }
