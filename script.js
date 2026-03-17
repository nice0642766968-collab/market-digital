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

// 1. จัดการประกาศสินค้า
document.getElementById('btnPost').addEventListener('click', () => {
    const name = document.getElementById('itemName').value;
    const price = Number(document.getElementById('itemPrice').value);
    const cat = document.getElementById('itemCategory').value;
    const detail = document.getElementById('itemDetail').value;

    if(name && price) {
        db.collection("cru_products").add({
            name, price, category: cat, detail,
            time: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            togglePostModal();
            alert("ลงประกาศเรียบร้อย!");
        });
    }
});

// 2. แสดงรายการสินค้าแบบ Real-time
db.collection("cru_products").orderBy("time", "desc").onSnapshot(snapshot => {
    const market = document.getElementById('marketList');
    market.innerHTML = '';
    snapshot.forEach(doc => {
        const item = doc.data();
        market.innerHTML += `
            <div class="product-card">
                <div class="product-info">
                    <span class="category-badge">${item.category}</span>
                    <h3>${item.name}</h3>
                    <p style="color:#666; font-size:0.9rem;">${item.detail}</p>
                    <div class="price-tag">฿${item.price.toLocaleString()}</div>
                    <button onclick="startChat('${doc.id}', '${item.name}')" class="btn-post-nav" style="width:100%; margin-top:10px;">ติดต่อสอบถาม</button>
                </div>
            </div>
        `;
    });
});

// 3. ระบบแชท
let currentRoomId = "";

function startChat(id, title) {
    currentRoomId = id;
    document.getElementById('chatBox').style.display = 'flex';
    document.getElementById('chatTitle').innerText = title;
    
    // โหลดข้อความ
    db.collection("chats").doc(id).collection("messages").orderBy("time")
    .onSnapshot(snap => {
        const display = document.getElementById('msgDisplay');
        display.innerHTML = '';
        snap.forEach(m => {
            const data = m.data();
            display.innerHTML += `<div class="msg"><b>นักศึกษา:</b> ${data.text}</div>`;
        });
        display.scrollTop = display.scrollHeight;
    });
}

document.getElementById('btnSend').addEventListener('click', () => {
    const text = document.getElementById('chatInput').value;
    if(text && currentRoomId) {
        db.collection("chats").doc(currentRoomId).collection("messages").add({
            text: text,
            time: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('chatInput').value = '';
    }
});

function togglePostModal() {
    const m = document.getElementById('postModal');
    m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

function closeChat() { document.getElementById('chatBox').style.display = 'none'; }
