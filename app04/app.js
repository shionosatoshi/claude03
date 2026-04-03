/**
 * Weather Forecast App
 * 天気予報と服装アドバイスを提供するアプリケーション
 * WeatherAPI.com対応版
 */

class WeatherApp {
    constructor() {
        this.apiKey = localStorage.getItem('weather-api-key') || '';
        this.currentGender = localStorage.getItem('weather-gender') || 'male';
        this.currentCity = localStorage.getItem('weather-last-city') || '';
        this.cacheData = null;
        this.cacheTime = null;
        const CACHE_DURATION = 30 * 60 * 1000; // 30分

        // DOM要素
        this.elements = {
            cityInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            refreshBtn: document.getElementById('refreshBtn'),
            cityName: document.getElementById('cityName'),
            updateTime: document.getElementById('updateTime'),
            todayIcon: document.getElementById('todayIcon'),
            todayTemp: document.getElementById('todayTemp'),
            todayDescription: document.getElementById('todayDescription'),
            todayHumidity: document.getElementById('todayHumidity'),
            todayWind: document.getElementById('todayWind'),
            todayFeelsLike: document.getElementById('todayFeelsLike'),
            maleBtn: document.getElementById('maleBtn'),
            femaleBtn: document.getElementById('femaleBtn'),
            clothingAdvice: document.getElementById('clothingAdvice'),
            forecastGrid: document.getElementById('forecastGrid'),
            forecastEmptyState: document.getElementById('forecastEmptyState'),
            apiKeyModal: document.getElementById('apiKeyModal'),
            apiKeyForm: document.getElementById('apiKeyForm'),
            apiKeyInput: document.getElementById('apiKeyInput'),
            closeApiKeyModalBtn: document.getElementById('closeApiKeyModalBtn'),
            cancelApiKeyBtn: document.getElementById('cancelApiKeyBtn'),
            errorModal: document.getElementById('errorModal'),
            errorMessage: document.getElementById('errorMessage'),
            closeErrorModalBtn: document.getElementById('closeErrorModalBtn'),
            closeErrorBtn: document.getElementById('closeErrorBtn')
        };

        // WeatherAPI.com の天気コードマッピング
        this.weatherCodeMap = {
            // 晴れ
            1000: '☀️',
            // 一時晴れ
            1003: '🌤️',
            // 曇り
            1006: '⛅',
            1009: '☁️',
            // 霧
            1030: '🌫️', 1135: '🌫️', 1147: '🌫️',
            // 雨
            1063: '🌧️', 1066: '🌧️', 1069: '🌧️', 1072: '🌧️', 1087: '⛈️',
            1150: '🌧️', 1153: '🌧️', 1168: '🌧️', 1171: '🌧️',
            1180: '🌧️', 1183: '🌧️', 1186: '🌧️', 1189: '🌧️',
            1192: '🌧️', 1195: '🌧️', 1198: '🌧️', 1201: '🌧️',
            1240: '🌧️', 1243: '🌧️', 1246: '🌧️', 1249: '🌧️',
            1252: '🌧️', 1255: '🌧️', 1258: '🌧️', 1261: '🌧️',
            1264: '🌧️', 1273: '🌧️', 1276: '🌧️', 1279: '🌧️',
            1282: '🌧️',
            // 雪
            1066: '🌨️', 1114: '🌨️', 1117: '🌨️', 1210: '🌨️', 1213: '🌨️',
            1216: '🌨️', 1219: '🌨️', 1222: '🌨️', 1225: '🌨️',
            1237: '🌨️', 1249: '🌨️', 1252: '🌨️', 1255: '🌨️',
            1258: '🌨️', 1261: '🌨️', 1264: '🌨️', 1279: '🌨️',
            1282: '🌨️',
            // 雷
            1087: '⛈️', 1279: '⛈️', 1282: '⛈️'
        };

        // 服装データ
        this.clothingData = {
            male: {
                hot: { icon: '👕', text: 'Tシャツ、半袖シャツ、短パン', sub: '涼しい服装で過ごしましょう' },
                warm: { icon: '👔', text: '長袖シャツ、薄手のパーカー', sub: '朝晩は少し涼しいです' },
                mild: { icon: '🧥', text: '薄手のジャケット、カーディガン、ジーンズ', sub: '重ね着で調整しましょう' },
                cool: { icon: '🧥', text: 'ジャケット、トレンチコート、長ズボン', sub: '保温性のある服装を' },
                cold: { icon: '🧥', text: '冬服、ダウンジャケット、厚手のズボン', sub: 'しっかり防寒しましょう' },
                freezing: { icon: '🧣', text: '厚手のコート、マフラー、手袋、インナー', sub: '完全防備で出かけましょう' }
            },
            female: {
                hot: { icon: '👗', text: 'ワンピース、半袖ブラウス、スカート', sub: '涼しい服装で過ごしましょう' },
                warm: { icon: '👚', text: '長袖ブラウス、薄手のカーディガン', sub: '朝晩は少し涼しいです' },
                mild: { icon: '🧥', text: '薄手のジャケット、カーディガン、デニム', sub: '重ね着で調整しましょう' },
                cool: { icon: '🧥', text: 'ジャケット、トレンチコート、ロングスカート/パンツ', sub: '保温性のある服装を' },
                cold: { icon: '🧥', text: '冬服、ダウンジャケット、厚手のボトムス', sub: 'しっかり防寒しましょう' },
                freezing: { icon: '🧣', text: '厚手のコート、マフラー、手袋、タイツ、インナー', sub: '完全防備で出かけましょう' }
            }
        };

        this.init();
    }

    async init() {
        this.bindEvents();
        this.updateGenderUI();

        // APIキーが未設定の場合はモーダルを表示
        if (!this.apiKey) {
            this.showApiKeyModal();
            return;
        }

        // キャッシュデータを読み込み
        this.loadFromCache();

        // キャッシュが有効な場合はそれを表示
        if (this.cacheData && this.isCacheValid()) {
            this.displayWeatherData(this.cacheData);
        } else if (this.currentCity) {
            // 最後の都市で天気を取得
            await this.getWeatherByCity(this.currentCity);
        } else {
            // 現在地を取得
            await this.getCurrentPositionWeather();
        }
    }

    bindEvents() {
        // 検索ボタン
        this.elements.searchBtn.addEventListener('click', () => {
            const city = this.elements.cityInput.value.trim();
            if (city) {
                this.getWeatherByCity(city);
            }
        });

        // Enterキーで検索
        this.elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = this.elements.cityInput.value.trim();
                if (city) {
                    this.getWeatherByCity(city);
                }
            }
        });

        // 現在地ボタン
        this.elements.locationBtn.addEventListener('click', () => {
            this.getCurrentPositionWeather();
        });

        // 更新ボタン
        this.elements.refreshBtn.addEventListener('click', () => {
            if (this.currentCity) {
                this.getWeatherByCity(this.currentCity);
            } else {
                this.getCurrentPositionWeather();
            }
        });

        // 性別切り替え
        this.elements.maleBtn.addEventListener('click', () => {
            this.currentGender = 'male';
            localStorage.setItem('weather-gender', 'male');
            this.updateGenderUI();
            if (this.cacheData) {
                this.renderClothingAdvice(this.cacheData.current.temp, this.cacheData.current.weatherCode);
            }
        });

        this.elements.femaleBtn.addEventListener('click', () => {
            this.currentGender = 'female';
            localStorage.setItem('weather-gender', 'female');
            this.updateGenderUI();
            if (this.cacheData) {
                this.renderClothingAdvice(this.cacheData.current.temp, this.cacheData.current.weatherCode);
            }
        });

        // APIキーモーダル
        this.elements.closeApiKeyModalBtn.addEventListener('click', () => {
            this.elements.apiKeyModal.classList.remove('active');
        });

        this.elements.cancelApiKeyBtn.addEventListener('click', () => {
            this.elements.apiKeyModal.classList.remove('active');
        });

        this.elements.apiKeyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const apiKey = this.elements.apiKeyInput.value.trim();
            if (apiKey) {
                this.apiKey = apiKey;
                localStorage.setItem('weather-api-key', apiKey);
                this.elements.apiKeyModal.classList.remove('active');
                // 天気データを再取得
                if (this.currentCity) {
                    this.getWeatherByCity(this.currentCity);
                } else {
                    this.getCurrentPositionWeather();
                }
            }
        });

        // エラーモーダル
        this.elements.closeErrorModalBtn.addEventListener('click', () => {
            this.elements.errorModal.classList.remove('active');
        });

        this.elements.closeErrorBtn.addEventListener('click', () => {
            this.elements.errorModal.classList.remove('active');
        });
    }

    updateGenderUI() {
        if (this.currentGender === 'male') {
            this.elements.maleBtn.classList.add('active');
            this.elements.femaleBtn.classList.remove('active');
        } else {
            this.elements.femaleBtn.classList.add('active');
            this.elements.maleBtn.classList.remove('active');
        }
    }

    async getCurrentPositionWeather() {
        if (!navigator.geolocation) {
            this.showError('お使いのブラウザは位置情報をサポートしていません。');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await this.fetchWeatherData(null, latitude, longitude);
            },
            (error) => {
                console.error('位置情報の取得に失敗:', error);
                this.showError('位置情報の取得に失敗しました。都市名を入力してください。');
            }
        );
    }

    async getWeatherByCity(cityName) {
        try {
            // WeatherAPI.comは都市名で直接検索可能
            await this.fetchWeatherData(cityName, null, null);
        } catch (error) {
            console.error('都市の取得に失敗:', error);
            this.showError('都市の取得に失敗しました。ネットワーク接続を確認してください。');
        }
    }

    async fetchWeatherData(cityName, lat = null, lon = null) {
        try {
            // WeatherAPI.comのエンドポイント
            let url = `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&days=3&aqi=no&alerts=no&lang=ja`;

            if (cityName) {
                url += `&q=${encodeURIComponent(cityName)}`;
            } else if (lat !== null && lon !== null) {
                url += `&q=${lat},${lon}`;
            } else {
                this.showError('都市名または座標を指定してください。');
                return;
            }

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    this.showError('APIキーが無効です。正しいキーを設定してください。');
                    this.showApiKeyModal();
                } else if (response.status === 400) {
                    this.showError('都市が見つかりませんでした。別の都市名を試してください。');
                } else if (response.status === 406) {
                    // 都市名が日本語ではない場合のエラー
                    this.showError('都市名は英語で入力してください（例：Tokyo, Osaka, London）');
                } else {
                    this.showError(`天気データの取得に失敗しました。(ステータス: ${response.status})`);
                }
                return;
            }

            const data = await response.json();
            this.processWeatherData(data);
        } catch (error) {
            console.error('天気データの取得に失敗:', error);
            this.showError('天気データの取得に失敗しました。ネットワーク接続を確認してください。');
        }
    }

    processWeatherData(data) {
        const city = data.location.name;
        const region = data.location.region;
        const country = data.location.country;

        // 今日の天気（現在の天気）
        const current = {
            temp: Math.round(data.current.temp_c),
            feelsLike: Math.round(data.current.feelslike_c),
            humidity: data.current.humidity,
            wind: Math.round(data.current.wind_kph),
            weatherCode: data.current.condition.code,
            description: data.current.condition.text
        };

        // 週間予報（WeatherAPI.comは3日分のみ）
        const forecast = [];
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

        // 今日を含む3日分
        data.forecast.forecastday.forEach((day, index) => {
            const date = new Date(day.date);
            forecast.push({
                date: date,
                highTemp: Math.round(day.day.maxtemp_c),
                lowTemp: Math.round(day.day.mintemp_c),
                weatherCode: day.day.condition.code,
                description: day.day.condition.text
            });
        });

        const weatherData = {
            city: city,
            region: region,
            country: country,
            current: current,
            forecast: forecast
        };

        // キャッシュに保存
        this.saveToCache(weatherData);

        // 表示
        this.displayWeatherData(weatherData);
    }

    displayWeatherData(data) {
        // 今日の天気
        this.elements.cityName.textContent = `${data.city}`;
        this.elements.updateTime.textContent = `最終更新: ${new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
        this.elements.todayIcon.textContent = this.getWeatherIcon(data.current.weatherCode);
        this.elements.todayTemp.textContent = data.current.temp;
        this.elements.todayDescription.textContent = data.current.description;
        this.elements.todayHumidity.textContent = `${data.current.humidity}%`;
        this.elements.todayWind.textContent = `${data.current.wind}km/h`;
        this.elements.todayFeelsLike.textContent = `${data.current.feelsLike}℃`;

        // 天気アイコンのアニメーションクラス
        this.elements.todayIcon.className = 'weather-icon';
        if (data.current.weatherCode === 1000) {
            this.elements.todayIcon.classList.add('sunny');
        } else if (data.current.weatherCode >= 1003 && data.current.weatherCode <= 1009) {
            this.elements.todayIcon.classList.add('cloudy');
        } else if (data.current.weatherCode >= 1063 && data.current.weatherCode < 1282) {
            this.elements.todayIcon.classList.add('rainy');
        }

        // 服装アドバイス
        this.renderClothingAdvice(data.current.temp, data.current.weatherCode);

        // 週間予報
        this.renderForecast(data.forecast);

        // 都市名を入力欄にセット
        if (data.city !== this.elements.cityInput.value) {
            this.elements.cityInput.value = data.city;
        }
    }

    renderClothingAdvice(temp, weatherCode) {
        const gender = this.currentGender;
        let clothing;

        // 気温に基づく服装
        if (temp >= 25) {
            clothing = this.clothingData[gender].hot;
        } else if (temp >= 20) {
            clothing = this.clothingData[gender].warm;
        } else if (temp >= 15) {
            clothing = this.clothingData[gender].mild;
        } else if (temp >= 10) {
            clothing = this.clothingData[gender].cool;
        } else if (temp >= 5) {
            clothing = this.clothingData[gender].cold;
        } else {
            clothing = this.clothingData[gender].freezing;
        }

        // 天候に基づくアクセサリー
        const accessories = [];
        // 雨（1063-1282の範囲で雨のコード）
        if ((weatherCode >= 1063 && weatherCode <= 1087) ||
            (weatherCode >= 1150 && weatherCode <= 1201) ||
            (weatherCode >= 1240 && weatherCode <= 1246)) {
            accessories.push('🌂 傘');
            accessories.push('👢 レインブーツ');
        }
        // 雪
        else if ((weatherCode >= 1114 && weatherCode <= 1117) ||
                 (weatherCode >= 1210 && weatherCode <= 1237) ||
                 (weatherCode >= 1249 && weatherCode <= 1282)) {
            accessories.push('🌂 傘');
            accessories.push('🧣 防寒具');
        }
        // 霧
        else if (weatherCode >= 1030 && weatherCode <= 1147) {
            accessories.push('😷 マスク');
        }

        // HTML生成
        let html = `
            <div class="clothing-item">
                <span class="clothing-icon">${clothing.icon}</span>
                <div class="clothing-text">
                    <div class="clothing-main">${clothing.text}</div>
                    <div class="clothing-sub">${clothing.sub}</div>
                </div>
            </div>
        `;

        if (accessories.length > 0) {
            html += '<div class="accessories">';
            accessories.forEach(item => {
                html += `<span class="accessory-item">${item}</span>`;
            });
            html += '</div>';
        }

        this.elements.clothingAdvice.innerHTML = html;
    }

    renderForecast(forecast) {
        this.elements.forecastEmptyState.style.display = 'none';

        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

        let html = '';
        forecast.forEach(day => {
            const dayName = dayNames[day.date.getDay()];
            const month = day.date.getMonth() + 1;
            const date = day.date.getDate();

            html += `
                <div class="forecast-card">
                    <div class="forecast-date">${month}/${date}</div>
                    <div class="forecast-day">${dayName}曜日</div>
                    <div class="forecast-icon">${this.getWeatherIcon(day.weatherCode)}</div>
                    <div class="forecast-temps">
                        <span class="forecast-temp-high">${day.highTemp}°</span>
                        <span class="forecast-temp-low">${day.lowTemp}°</span>
                    </div>
                </div>
            `;
        });

        this.elements.forecastGrid.innerHTML = html;
    }

    getWeatherIcon(code) {
        return this.weatherCodeMap[code] || '☀️';
    }

    saveToCache(data) {
        this.cacheData = data;
        this.cacheTime = Date.now();
        localStorage.setItem('weather-cache', JSON.stringify(data));
        localStorage.setItem('weather-cache-time', this.cacheTime.toString());
    }

    loadFromCache() {
        const cache = localStorage.getItem('weather-cache');
        const cacheTime = localStorage.getItem('weather-cache-time');

        if (cache && cacheTime) {
            try {
                this.cacheData = JSON.parse(cache);
                this.cacheTime = parseInt(cacheTime);
            } catch (error) {
                console.error('キャッシュの読み込みに失敗:', error);
                this.cacheData = null;
                this.cacheTime = null;
            }
        }
    }

    isCacheValid() {
        if (!this.cacheTime) return false;
        const now = Date.now();
        const CACHE_DURATION = 30 * 60 * 1000; // 30分
        return (now - this.cacheTime) < CACHE_DURATION;
    }

    showApiKeyModal() {
        this.elements.apiKeyModal.classList.add('active');
        if (this.apiKey) {
            this.elements.apiKeyInput.value = this.apiKey;
        }
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorModal.classList.add('active');
    }
}

// アプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
