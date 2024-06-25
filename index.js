const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'app')));

// パスワード入力ページへのルート
app.get('/index1.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/index1.html'));
});

// メインページへのルート
app.get('/kakaomame', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/index.html'));
});

// サーバー起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
