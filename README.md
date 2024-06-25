<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    クッキークリッカー
</head>
<body>
<div class="top-bar">
    <div>
        <input type="text" id="shopNameInput" placeholder="クッキー屋さんの名前を入力" oninput="updateShopName()" />
        <button onclick="randomizeShopName()">ランダムに選ぶ</button>
    </div>
    <div>
        <p id="xpCounter">経験値: 0</p>
        <p id="cheatMessage">チート発動</p>
        <p id="antiCheatMessage">チート解除</p>
    </div>
    <div>
        <button id="saveButton" onclick="saveGame()">セーブ</button>
        <button id="loadButton" onclick="showLoadPrompt()">セーブデータ読み込み</button>
    </div>
</div><br>
<div class="left-section">
<br>
    <p id="cookieCounter">クッキー: 0</p>
    <div id="clicker"><span class="clicker-icon" onclick="clickCookie()">🍪</span></div>
<br>
    <p id="cps">クッキー/秒: 0</p>
</div>
<div class="right-section">
    <div id="cursor" class="shop-item">
        <span class="icon" onclick="buyCursor()">👆</span>
        <button id="buyCursorButton" onclick="buyCursor()">カーソルを購入 (15クッキー)</button>
    </div>
    <div id="granny" class="shop-item">
        <span class="icon" onclick="buyGranny()">👵</span>
        <button id="buyGrannyButton" onclick="buyGranny()">おばあちゃんを雇う (100クッキー)</button>
    </div>
    <div id="farm" class="shop-item">
        <span class="icon" onclick="buyFarm()">🌾</span>
        <button id="buyFarmButton" onclick="buyFarm()">農場を購入 (1,100クッキー)</button>
    </div>
    <div id="mine" class="shop-item">
        <span class="icon" onclick="buyMine()">⛏️</span>
        <button id="buyMineButton" onclick="buyMine()">鉱山を購入 (12,000クッキー)</button>
    </div>
    <div id="factory" class="shop-item">
        <span class="icon" onclick="buyFactory()">🏭</span>
        <button id="buyFactoryButton" onclick="buyFactory()">工場を購入 (130,000クッキー)</button>
    </div>
    <div id="temple" class="shop-item">
        <span class="icon" onclick="buyTemple()">⛩️</span>
        <button id="buyTempleButton" onclick="buyTemple()">神殿を購入 (2,000,000クッキー)</button>
    </div>
    <div id="tower" class="shop-item">
        <span class="icon" onclick="buyTower()">🏰</span>
        <button id="buyTowerButton" onclick="buyTower()">魔法の塔を購入 (33,000,000クッキー)</button>
    </div>
    <div id="ship" class="shop-item">
        <span class="icon" onclick="buyShip()">🚢</span>
        <button id="buyShipButton" onclick="buyShip()">貨物船を購入 (510,000,000クッキー)</button>
    </div>
</div>
<div class="bottom-section">
    <div>
        <button id="gachaNormalButton" class="gacha-button" onclick="rollGacha('normal')">ノーマルガチャ (10クッキー)</button>
        <button id="gachaRareButton" class="gacha-button" onclick="rollGacha('rare')">レアガチャ (100クッキー)</button>
        <button id="gachaEpicButton" class="gacha-button" onclick="rollGacha('epic')">エピックガチャ (1,000クッキー)</button>
    </div>
    <div>
        <h2>エンチャント</h2>
        <button class="enchant-button" onclick="enchant()">エンチャント (150クッキー)</button>
    </div>
</div>
<div>
    <h2>実績</h2>
    <ul id="achievements"></ul>
</div>
<div id="loadPrompt" style="display:none;">
    <input type="text" id="saveCodeInput" placeholder="セーブコードを入力" />
    <button id="loadGameButton" onclick="loadGame()">読み込み</button>
    <button id="closeButton" onclick="hideLoadPrompt()">閉じる</button>
</div>
<div id="saveCodeDisplay"></div>
<div id="cheatOptions">
    <label for="cheatCookies">クッキー数:</label>
    <input type="number" id="cheatCookies" min="0" />
    <label for="cheatXp">経験値:</label>
    <input type="number" id="cheatXp" min="0" />
    <button onclick="applyCheats()">適用</button>
</div>
<!-- チートトグルボタン -->
<button id="cheatToggleButton" onclick="toggleCheatMode()">入力ミス</button>

<script>
    var cookieCount = 0;
    var cursors = 0;
    var grannies = 0;
    var farms = 0;
    var mines = 0;
    var factories = 0;
    var temples = 0;
    var towers = 0;
    var ships = 0;
    var cps = 0;
    var xp = 0;
    var cheatMode = false;
    var hasUsedCheat = false;

    var cookieCounter = document.getElementById('cookieCounter');
    var cpsCounter = document.getElementById('cps');
    var xpCounter = document.getElementById('xpCounter');
    var shopNameElement = document.getElementById('shopName');
    var cheatMessage = document.getElementById('cheatMessage');
    var antiCheatMessage = document.getElementById('antiCheatMessage');
    var shopNameInput = document.getElementById('shopNameInput');
    var loadPrompt = document.getElementById('loadPrompt');
    var saveCodeInput = document.getElementById('saveCodeInput');
    var saveCodeDisplay = document.getElementById('saveCodeDisplay');
    var achievementsList = document.getElementById('achievements');
    var cheatOptions = document.getElementById('cheatOptions');

    // チートトグル用の関数
    function toggleCheatMode() {
        cheatMode = !cheatMode;
        cheatOptions.style.display = cheatMode ? 'flex' : 'none';
        cheatMessage.style.display = cheatMode ? 'block' : 'none';
        antiCheatMessage.style.display = cheatMode ? 'none' : 'block';
    }

    // チートを適用する関数
    function applyCheats() {
        var cheatCookiesInput = document.getElementById('cheatCookies');
        var cheatXpInput = document.getElementById('cheatXp');

        if (cheatCookiesInput.value !== '') {
            cookieCount = parseInt(cheatCookiesInput.value);
            updateCookieCounter();
        }
        if (cheatXpInput.value !== '') {
            xp = parseInt(cheatXpInput.value);
            updateXpCounter();
        }
    }

    // クッキーをクリックする関数
    function clickCookie() {
        cookieCount++;
        updateCookieCounter();
    }

    // 経験値を更新する関数
    function updateXpCounter() {
        xpCounter.textContent = '経験値: ' + xp;
    }

    // クッキーのカウンターを更新する関数
    function updateCookieCounter() {
        cookieCounter.textContent = 'クッキー: ' + cookieCount;
    }

    // 経験値を追加する関数
    function addXp(amount) {
        xp += amount;
        updateXpCounter();
    }

    // セーブ機能
    function saveGame() {
        var saveData = {
            cookieCount: cookieCount,
            cursors: cursors,
            grannies: grannies,
            farms: farms,
            mines: mines,
            factories: factories,
            temples: temples,
            towers: towers,
            ships: ships,
            cps: cps,
            xp: xp
        };
        var saveCode = btoa(JSON.stringify(saveData));
        saveCodeDisplay.textContent = 'セーブコード: ' + saveCode;
    }

    // セーブデータをロードするプロンプトを表示する関数
    function showLoadPrompt() {
        loadPrompt.style.display = 'block';
    }

    // セーブデータをロードするプロンプトを隠す関数
    function hideLoadPrompt() {
        loadPrompt.style.display = 'none';
    }

    // セーブデータを読み込む関数
    function loadGame() {
        var saveCode = saveCodeInput.value;
        try {
            var saveData = JSON.parse(atob(saveCode));
            cookieCount = saveData.cookieCount;
            cursors = saveData.cursors;
            grannies = saveData.grannies;
            farms = saveData.farms;
            mines = saveData.mines;
            factories = saveData.factories;
            temples = saveData.temples;
            towers = saveData.towers;
            ships = saveData.ships;
            cps = saveData.cps;
            xp = saveData.xp;
            updateCookieCounter();
            updateXpCounter();
            hideLoadPrompt();
        } catch (e) {
            alert('セーブデータが無効です');
        }
    }

    // 商品を購入する関数
    function buyCursor() {
        if (cookieCount >= 15) {
            cookieCount -= 15;
            cursors++;
            updateCookieCounter();
            updateCps();
        }
    }

    function buyGranny() {
        if (cookieCount >= 100) {
            cookieCount -= 100;
            grannies++;
            updateCookieCounter();
            updateCps();
        }
    }

    function buyFarm() {
        if (cookieCount >= 1100) {
            cookieCount -= 1100;
            farms++;
            updateCookieCounter();
            updateCps();
        }
    }

    function buyMine() {
        if (cookieCount >= 12000) {
            cookieCount -= 12000;
            mines++;
            updateCookieCounter();
            updateCps();
        }
    }

    function buyFactory() {
        if (cookieCount >= 130000) {
            cookieCount -= 130000;
            factories++;
            updateCookieCounter();
            updateCps();
        }
    }

    function buyTemple() {
        if (cookieCount >= 2000000) {
            cookieCount -= 2000000;
            temples++;
            updateCookieCounter();
            updateCps();
        }
    }

    function buyTower() {
        if (cookieCount >= 33000000) {
            cookieCount -= 33000000;
            towers++;
            updateCookieCounter();
            updateCps();
        }
    }

    function buyShip() {
        if (cookieCount >= 510000000) {
            cookieCount -= 510000000;
            ships++;
            updateCookieCounter();
            updateCps();
        }
    }

    // クッキー/秒を更新する関数
    function updateCps() {
        cps = cursors + grannies * 10 + farms * 100 + mines * 200 + factories * 1000 + temples * 10000 + towers * 50000 + ships * 100000;
        cpsCounter.textContent = 'クッキー/秒: ' + cps;
    }

    // 実績を解除する関数
    function unlockAchievement(name) {
        var li = document.createElement('li');
        li.textContent = name;
        achievementsList.appendChild(li);
        addXp(10);
    }

    // 店舗名を更新する関数
    function updateShopName() {
        var shopName = shopNameInput.value;
        shopNameElement.textContent = shopName || 'クッキー屋さん';
    }

    // 店舗名をランダムに選ぶ関数
    function randomizeShopName() {
        var shopNames = ['おいしいクッキー', '幸せのクッキー', '夢のクッキー', '魔法のクッキー'];
        var randomName = shopNames[Math.floor(Math.random() * shopNames.length)];
        shopNameInput.value = randomName;
        updateShopName();
    }

    // 1秒ごとにクッキーを増加させる
    setInterval(function() {
        cookieCount += cps;
        updateCookieCounter();
    }, 1000);
</script>
</body>
</html>
