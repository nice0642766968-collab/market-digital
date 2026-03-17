// ฟังก์ชันคำนวณค่าหารอัตโนมัติใน Modal
function calculateSplit() {
    const price = document.getElementById('itemPrice').value;
    const count = document.getElementById('splitCount').value;
    const resultDiv = document.getElementById('splitResult');

    if (price && count > 0) {
        const perPerson = (price / count).toLocaleString();
        resultDiv.innerText = `ราคาต่อคน: ฿${perPerson}`;
        resultDiv.style.color = "#1a237e";
    } else {
        resultDiv.innerText = `ราคาต่อคน: ฿0`;
    }
}

// ระบบจัดการการเข้าสู่ระบบ (Firebase Auth)
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
    })
    .catch((error) => {
        alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
    });
}

// ตรวจสอบสถานะการ Login เมื่อโหลดหน้าเว็บ
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
    } else {
        document.getElementById('authContainer').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }
});

function handleLogout() {
    firebase.auth().signOut();
}

// ฟังก์ชันเปิด/ปิด Modal
function openModal() { document.getElementById('postModal').style.display = 'flex'; }
function closeModal() { document.getElementById('postModal').style.display = 'none'; }
