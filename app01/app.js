// カレンダーアプリのメインロジック

class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.diaryData = this.loadDiaryData();

        this.initializeElements();
        this.attachEventListeners();
        this.renderCalendar();
        this.displayQuoteForDate(new Date());
    }

    initializeElements() {
        this.monthDisplay = document.getElementById('currentMonth');
        this.calendarGrid = document.getElementById('calendarGrid');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.diaryDateTitle = document.getElementById('diaryDateTitle');
        this.diaryText = document.getElementById('diaryText');
        this.saveBtn = document.getElementById('saveBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.saveStatus = document.getElementById('saveStatus');
        this.quoteText = document.getElementById('dailyQuote');
        this.quoteAuthor = document.getElementById('quoteAuthor');
    }

    attachEventListeners() {
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        this.saveBtn.addEventListener('click', () => this.saveDiary());
        this.deleteBtn.addEventListener('click', () => this.deleteDiary());
        this.calendarGrid.addEventListener('click', (e) => this.handleDayClick(e));
    }

    // LocalStorageから日記データを読み込み
    loadDiaryData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('diary-')) {
                const date = key.replace('diary-', '');
                data[date] = localStorage.getItem(key);
            }
        }
        return data;
    }

    // 月の表示を更新
    updateMonthDisplay() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        this.monthDisplay.textContent = `${year}年 ${month}月`;
    }

    // カレンダーを描画
    renderCalendar() {
        this.updateMonthDisplay();
        this.calendarGrid.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // 月の最初の日と最後の日を取得
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay(); // 0=日曜日
        const daysInMonth = lastDay.getDate();

        // 今日の日付
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        // 空白セル（月の初日より前）
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            this.calendarGrid.appendChild(emptyCell);
        }

        // 日付セルを作成
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = day;

            const dateStr = this.formatDate(year, month, day);
            dayCell.dataset.date = dateStr;

            // 今日の日付をハイライト
            if (isCurrentMonth && day === today.getDate()) {
                dayCell.classList.add('today');
            }

            // 選択中の日付をハイライト
            if (this.selectedDate === dateStr) {
                dayCell.classList.add('selected');
            }

            // 日記がある場合はインジケーターを表示
            if (this.diaryData[dateStr]) {
                dayCell.classList.add('has-diary');
            }

            this.calendarGrid.appendChild(dayCell);
        }
    }

    // 月を変更
    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }

    // 日付クリックを処理
    handleDayClick(e) {
        const dayCell = e.target.closest('.day-cell');
        if (!dayCell || dayCell.classList.contains('empty')) {
            return;
        }

        const dateStr = dayCell.dataset.date;
        this.selectDate(dateStr);
    }

    // 日付を選択
    selectDate(dateStr) {
        this.selectedDate = dateStr;

        // カレンダーの選択状態を更新
        const allDays = this.calendarGrid.querySelectorAll('.day-cell');
        allDays.forEach(day => {
            day.classList.remove('selected');
            if (day.dataset.date === dateStr) {
                day.classList.add('selected');
            }
        });

        // 日記エディタを更新
        const [year, month, day] = dateStr.split('-').map(Number);
        this.diaryDateTitle.textContent = `${year}年${month}月${day}日の日記`;
        this.diaryText.value = this.diaryData[dateStr] || '';
        this.diaryText.disabled = false;
        this.saveBtn.disabled = false;
        this.deleteBtn.disabled = !this.diaryData[dateStr];

        // 選択した日付の名言を表示
        this.displayQuoteForDate(new Date(year, month - 1, day));

        // ステータスをクリア
        this.saveStatus.textContent = '';
        this.saveStatus.className = 'save-status';

        // テキストエリアにフォーカス
        this.diaryText.focus();
    }

    // 日記を保存
    saveDiary() {
        if (!this.selectedDate) return;

        const content = this.diaryText.value.trim();

        if (content) {
            localStorage.setItem(`diary-${this.selectedDate}`, content);
            this.diaryData[this.selectedDate] = content;
            this.showSaveStatus('保存しました', 'success');
            this.deleteBtn.disabled = false;
        } else {
            localStorage.removeItem(`diary-${this.selectedDate}`);
            delete this.diaryData[this.selectedDate];
            this.showSaveStatus('削除しました', 'success');
            this.deleteBtn.disabled = true;
        }

        // カレンダーを再描画してインジケーターを更新
        this.renderCalendar();
    }

    // 日記を削除
    deleteDiary() {
        if (!this.selectedDate || !this.diaryData[this.selectedDate]) return;

        if (confirm('この日記を削除しますか？')) {
            localStorage.removeItem(`diary-${this.selectedDate}`);
            delete this.diaryData[this.selectedDate];
            this.diaryText.value = '';
            this.deleteBtn.disabled = true;
            this.showSaveStatus('削除しました', 'success');

            // カレンダーを再描画してインジケーターを更新
            this.renderCalendar();
        }
    }

    // 保存ステータスを表示
    showSaveStatus(message, type) {
        this.saveStatus.textContent = message;
        this.saveStatus.className = `save-status ${type}`;

        // 3秒後にステータスを消す
        setTimeout(() => {
            this.saveStatus.textContent = '';
            this.saveStatus.className = 'save-status';
        }, 3000);
    }

    // 日付をフォーマット (YYYY-MM-DD)
    formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // 指定した日付の名言を表示
    displayQuoteForDate(date) {
        const quotes = this.getQuotes();
        const dayOfYear = this.getDayOfYear(date);
        const quoteIndex = dayOfYear % quotes.length;

        const quote = quotes[quoteIndex];
        this.quoteText.textContent = quote.text;
        this.quoteAuthor.textContent = quote.author;
    }

    // 年間での通算日を取得（1月1日を0とする）
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = date.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // 名言データ
    getQuotes() {
        return [
            // 日本の名言
            { text: "七転び八起き", author: "日本のことわざ" },
            { text: "継続は力なり", author: "日本のことわざ" },
            { text: "千里の道も一歩から", author: "老子" },
            { text: "花は桜木人は武士", author: "日本のことわざ" },
            { text: "失敗は成功のもと", author: "日本のことわざ" },
            { text: "器用貧乏より鈍工 fort不", author: "渋沢栄一" },
            { text: "青春は二度とない。だからこそ、若い時代に全力で走り抜けたい", author: "坂本龍馬" },
            { text: "人間、事をなして天を恨まず、我を知る者は己のみ", author: "宮沢賢治" },
            { text: "明日は明日の風が吹く", author: "日本のことわざ" },
            { text: "難関は必ず突破できる。なぜなら、人は自分が考えたことしか実現できないからだ", author: "本田宗一郎" },

            // 世界の名言
            { text: "私は失敗したことがない。ただ、1000通り、うまくいかない方法を見つけただけだ", author: "トーマス・エジソン" },
            { text: "人生は何かを待つものではなく、自ら進んで切り開いていくものだ", author: "マハトマ・ガンディー" },
            { text: "天は自ら助くる者を助く", author: "ベンジャミン・フランクリン" },
            { text: "成功とは、失敗に失敗を重ねても熱意を失わないことだ", author: "ウィンストン・チャーチル" },
            { text: "行動こそがあらゆる成功の基本である", author: "パブロ・ピカソ" },
            { text: "人生を変えるには、人生の想定外の出来事を受け入れることだ", author: "アルバート・アインシュタイン" },
            { text: "道のりは長いが、一歩ずつ確実に進めば、必ず目的地に到達できる", author: "マーティン・ルーサー・キング・ジュニア" },
            { text: "強い理由じゃない。強いから生き残るんだ", author: "チャールズ・ダーウィン" },
            { text: "人生で重要なのは、私たちが何に直面したかではなく、どう対応したかだ", author: "ヘレン・ケラー" },
            { text: "夢を見るなら、目覚める時が来る。夢を実現するために努力する時だ", author: "A.P.J. アブドゥル・カラーム" },

            // ポジティブな言葉・励まし
            { text: "今日の一歩は、明日の千里", author: "中国のことわざ" },
            { text: "小さな一歩が大きな変化を生む", author: "" },
            { text: "希望は、夢を見ることではなく、夢を現実にすることだ", author: "" },
            { text: "心に太陽を持てば、影はない", author: "" },
            { text: "自分を信じるなら、世界は味方になる", author: "" },
            { text: "困難は成長のチャンス", author: "" },
            { text: "前を向いて進もう、過去は変えられないが未来は変えられる", author: "" },
            { text: "諦めなければ、夢は叶う", author: "" },
            { text: "やればできる。できないのは、やらないからだ", author: "" },
            { text: "自分を愛そう。それが全ての始まりだ", author: "" },
            { text: "今日は新しい始まりの日", author: "" },
            { text: "小さな成功を積み重ねよう", author: "" },
            { text: "誰かの役に立つことが、最高の喜び", author: "" },
            { text: "笑顔は最高のプレゼント", author: "" },
            { text: "感謝の心を忘れずに", author: "" },
            { text: "今日も一日、精一杯生きよう", author: "" },
            { text: "困った時こそ、笑顔を", author: "" },
            { text: "人生は一度きり。思い切り楽しもう", author: "" },
            { text: "自分らしさを大切に", author: "" },
            { text: "すべては今から始まる", author: "" },

            // 日本の偉人の言葉
            { text: "人間、事をなして天を恨まず", author: "夏目漱石" },
            { text: "己れを知る者は、最も賢明なる人なり", author: "松尾芭蕉" },
            { text: "志を立てて以って万事の源となす", author: "吉田松陰" },
            { text: "維新の志、我にあり", author: "西郷隆盛" },
            { text: "技術に芸術を、芸術に技術を", author: "本田宗一郎" },
            { text: "なせば成る、なさねば成らぬ何事も", author: "上杉鷹山" },
            { text: "己れを磨くは、一日一生", author: "二宮尊徳" },
            { text: "無私こそが人間の最高の徳", author: "西田幾多郎" },

            // 世界のリーダー・思想家
            { text: "自由は何も与えない。むしろ、自分自身を与える機会を与えてくれる", author: "ジャン＝ポール・サルトル" },
            { text: "我々は直面している問題を作り出したのと同じ思考レベルでは、それらを解決できない", author: "アルバート・アインシュタイン" },
            { text: "平和とは、戦争がない状態ではなく、正義が支配している状態だ", author: "アリストテレス" },
            { text: "人生で最も重要な問いは、あなたが何を受け取るかではなく、何を与えるかだ", author: "ケネディ大統領" },
            { text: "変化は機会だ。脅威ではない", author: "ジャック・ウェルチ" },

            // 東洋の知恵
            { text: "上善は水の如し", author: "老子" },
            { text: "学而時習之、不亦説乎", author: "孔子" },
            { text: "知者は惑わず、仁者は憂えず、勇者は恐れず", author: "孔子" },
            { text: "困難は避けられない。態度は選べる", author: "仏教の教え" },
            { text: "花は一瞬、永遠に咲く", author: "禅の言葉" },

            // 現代の言葉
            { text: "Perfect is the enemy of good", author: "ヴォルテール" },
            { text: "Done is better than perfect", author: "シェリ・サンドバーグ" },
            { text: "Just do it", author: "ナイキ" },
            { text: "Stay hungry, stay foolish", author: "スティーブ・ジョブズ" },
            { text: "Think different", author: "アップル" },

            // その他の名言
            { text: "人生は旅だ。目的地よりも道のりが大事", author: "" },
            { text: "友情は心の鏡", author: "" },
            { text: "愛は全てを癒す", author: "" },
            { text: "時間は待ってくれない。今行動しよう", author: "" },
            { text: "人生は劇場。舞台は自分で作る", author: "" },
            { text: "才能は開花させるもの。持っているものではない", author: "" },
            { text: "歴史は繰り返す", author: "" },
            { text: "知識は力。行動はその力を現実にする", author: "" },
            { text: "成功するまでやめない。やめるなら成功する前に", author: "" },
            { text: "今日の涙は明日の花", author: "" }
        ];
    }
}

// アプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new CalendarApp();
});
