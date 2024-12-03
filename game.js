// Khai báo các biến toàn cục cần thiết
const hinhAnh = [
    'images/QooBee1.jpg', 'images/QooBee2.jpg', 'images/QooBee3.jpg', 'images/QooBee4.jpg',
    'images/QooBee5.jpg', 'images/QooBee6.jpg', 'images/QooBee7.jpg', 'images/QooBee8.jpg',
    'images/QooBee9.jpg', 'images/QooBee10.jpg', 'images/QooBee11.jpg', 'images/QooBee12.jpg',
    'images/QooBee13.jpg', 'images/QooBee14.jpg', 'images/QooBee15.jpg', 'images/QooBee16.jpg'
];
const theBaiGame = [...hinhAnh, ...hinhAnh];
let theDauTien = null, // Thẻ đầu tiên đã lật
    theThuHai = null,  // Thẻ thứ hai đã lật
    khoaBan = false,   // Kiểm soát việc lật thẻ (tránh lật quá nhanh)
    theDaKhop = 0,     // Số lượng thẻ đã khớp
    thoiGianConLai = 180, // Thời gian còn lại (giây)
    boDemThoiGian;     // Biến lưu trữ ID của bộ đếm thời gian

// Hàm cập nhật thời gian còn lại
function capNhatHienThiThoiGian() {
    const phut = Math.floor(thoiGianConLai / 60); // Lấy phút
    const giay = thoiGianConLai % 60;  // Lấy giây
    document.querySelector("#timer").textContent = `Thời gian còn lại: ${phut}:${giay < 10 ? '0' + giay : giay}`;
    document.querySelector("#timer").classList.add("flash");
    setTimeout(() => document.querySelector("#timer").classList.remove("flash"), 200);
}

// Hàm giảm thời gian
function decrementThoiGian() {
    if (thoiGianConLai > 0) {
        thoiGianConLai--;
        capNhatHienThiThoiGian();
    } else {
        clearInterval(boDemThoiGian); // Dừng bộ đếm thời gian khi hết giờ
        gameOver(); // Kết thúc trò chơi
    }
}

// Hàm kết thúc trò chơi khi hết giờ
function gameOver() {
    khoaBan = true;
    document.querySelector("#message").textContent = "Hết giờ!!!!!!";
}

// Hàm kiểm tra nếu hai thẻ bài có khớp không
function kiemTraTrungKhop() {
    const hinhDauTien = theDauTien.querySelector("img").src;
    const hinhThuHai = theThuHai.querySelector("img").src;
    if (hinhDauTien === hinhThuHai) {
        theDauTien.classList.add("matched");
        theThuHai.classList.add("matched");
        theDaKhop += 2;
        if (theDaKhop === theBaiGame.length) document.querySelector("#message").textContent = "Bạn đã chiến thắng!";
        datLaiBan();
    } else {
        khoaBan = true;
        setTimeout(() => {
            theDauTien.classList.remove("flipped");
            theThuHai.classList.remove("flipped");
            datLaiBan();
        }, 1000);
    }
}

// Hàm đặt lại các biến sau mỗi lần kiểm tra
function datLaiBan() {
    theDauTien = theThuHai = null;
    khoaBan = false;
}

// Hàm lật thẻ
function latThe() {
    if (khoaBan || this.classList.contains("flipped")) return;
    this.classList.add("flipped");

    if (!theDauTien) {
        theDauTien = this;
    } else {
        theThuHai = this;
        kiemTraTrungKhop();
    }
}

// Hàm hiển thị tất cả các thẻ trong 2 giây khi bắt đầu trò chơi
function hienThiTatCaThe() {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('flipped');
    });

    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flipped');
        });
        khoaBan = false; // Mở khóa bàn chơi sau khi thẻ đã lật lại
    }, 2000);
}

// Hàm bắt đầu trò chơi
function batDauGame() {
    document.querySelector("#gameBoard").innerHTML = "";
    document.querySelector("#message").textContent = "";
    thoiGianConLai = 180;
    capNhatHienThiThoiGian();
    theDauTien = theThuHai = null;
    theDaKhop = 0;
    khoaBan = true; // Khóa bàn chơi tạm thời

    theBaiGame.forEach(hinh => {
        const the = document.createElement("div");
        the.classList.add("card");
        const theBenTrong = document.createElement("div");
        theBenTrong.classList.add("card-inner");
        theBenTrong.innerHTML = `<div class="card-front"><img src="${hinh}" /></div><div class="card-back"></div>`;
        the.appendChild(theBenTrong);
        the.addEventListener("click", latThe);
        document.querySelector("#gameBoard").appendChild(the);
    });

    // Hiển thị tất cả các thẻ trong 2 giây
    setTimeout(hienThiTatCaThe, 500);

    clearInterval(boDemThoiGian);
    boDemThoiGian = setInterval(decrementThoiGian, 1000);
}

// Lắng nghe sự kiện bắt đầu trò chơi
document.querySelector("#startGame").addEventListener("click", batDauGame);

// Bắt đầu trò chơi ngay lập tức khi tải trang
batDauGame();
