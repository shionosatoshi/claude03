// Service Worker for Split Bill App
const CACHE_NAME = 'split-bill-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
    console.log('📦 Service Workerインストール中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ ファイルをキャッシュ中:', urlsToCache);
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ インストール完了');
                return self.skipWaiting(); // 新しいSWを即座にアクティブ化
            })
    );
});

// フェッチ時にキャッシュを使用
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュがあればそれを返す
                if (response) {
                    console.log('📦 キャッシュヒット:', event.request.url);
                    return response;
                }
                // なければネットワークにリクエスト
                console.log('🌐 ネットワークリクエスト:', event.request.url);
                return fetch(event.request).then((response) => {
                    // レスポンスが有効であればキャッシュに保存
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // レスポンスをクローンしてキャッシュに保存
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Workerアクティベート中...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // ホワイトリストにないキャッシュを削除
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('🗑️ 古いキャッシュを削除:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ アクティベート完了');
            return self.clients.claim(); // 新しいSWを即座に制御
        })
    );
});

// メッセージ受信（キャッシュ手動更新など）
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
