// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 地形の生成
function generateTerrain() {
    const terrain = new THREE.Group();
    const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const dirtMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
    const stoneMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const oreMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    for (let x = 0; x < 100; x++) {
        for (let z = 0; z < 100; z++) {
            // 草ブロック
            const grassBlock = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), grassMaterial);
            grassBlock.position.set(x, 63, z);
            terrain.add(grassBlock);

            // 土ブロック
            for (let y = 62; y >= 60; y--) {
                const dirtBlock = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), dirtMaterial);
                dirtBlock.position.set(x, y, z);
                terrain.add(dirtBlock);
            }

            // 石ブロック
            for (let y = 59; y >= 0; y--) {
                const stoneBlock = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), stoneMaterial);
                stoneBlock.position.set(x, y, z);
                terrain.add(stoneBlock);

                // 鉱石
                if (Math.random() < 0.05) {
                    const oreBlock = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), oreMaterial);
                    oreBlock.position.set(x, y, z);
                    terrain.add(oreBlock);
                }
            }
        }
    }
    return terrain;
}

const terrain = generateTerrain();
scene.add(terrain);

// プレイヤーの設定
const player = {
    position: new THREE.Vector3(50, 65, 50),
    emeralds: 0, // プレイヤーのエメラルド所持数
    velocity: new THREE.Vector3()
};

// プレイヤーのモデル（簡易ボックス）
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
playerMesh.position.copy(player.position);
scene.add(playerMesh);

// 照明の設定
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// サウンドの設定
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('path_to_sound_file.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
});

// 時間と明るさの設定
let timeOfDay = 0; // 0から23までの値で表現（0は夜、12は昼）
let brightness = 4; // 初期値は夜の明るさ

// 基本的なモブクラス
class Mob {
    constructor(type, color, initialPosition, scale = 1) {
        const geometry = new THREE.BoxGeometry(scale, scale, scale);
        const material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(initialPosition);
        this.type = type;
        this.scale = scale;
        this.health = 10; // デフォルトのヘルス
        scene.add(this.mesh);
    }
    
    move(direction) {
        this.mesh.position.add(direction);
    }

    act() {
        let direction = new THREE.Vector3();
        if (this.type === 'enemy') {
            direction = player.position.clone().sub(this.mesh.position).normalize().multiplyScalar(0.05);
        } else if (this.type === 'neutral') {
            direction = new THREE.Vector3((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.1);
        } else if (this.type === 'friendly' || this.type === 'villager') {
            // 特に行動なし
        }
        this.move(direction);
    }

    attack(target) {
        if (this.type === 'ゾンビ' || this.type === 'エンダーマン' || this.type === 'ウィザースケルトン') {
            target.health -= 2; // 素手や棒での攻撃
        } else if (this.type === 'スケルトン') {
            target.health -= 3; // 弓矢での攻撃
        } else if (this.type === 'ブレイズ') {
            target.health -= 4; // 火の玉攻撃
        } else if (this.type === 'ピグリン' || this.type === 'ゾンビピグリン') {
            target.health -= 3; // 剣やクロスボウでの攻撃
        } else if (this.type === 'エンダードラゴン') {
            target.health -= 6; // ブレス攻撃
        } else if (this.type === 'ウィザー') {
            target.health -= 5; // 頭を飛ばして攻撃
        } else if (this.type === 'ウォーデン') {
            target.health -= 7; // 衝撃波や近接攻撃
        }
        console.log(`${this.type} attacked ${target.type}. ${target.type} has ${target.health} health remaining.`);
    }
}

// ボスモブクラス
class BossMob extends Mob {
    constructor(type, color, initialPosition, scale) {
        super(type, color, initialPosition, scale);
        this.health = 100; // ボスモブのヘルス
    }

    act() {
        let direction = player.position.clone().sub(this.mesh.position).normalize().multiplyScalar(0.03);
        this.move(direction);
    }
}

// 村人クラス（取引機能付き）
class Villager extends Mob {
    constructor(type, color, initialPosition, trades) {
        super(type, color, initialPosition);
        this.trades = trades; // 取引アイテムのリスト
    }

    trade(player) {
        if (player.emeralds > 0) {
            player.emeralds--;
            console.log(`Traded with ${this.type}. Remaining emeralds: ${player.emerald
