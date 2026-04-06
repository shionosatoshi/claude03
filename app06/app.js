// ランダム話題テンプレート（全く関係ない話題を3行で出力）
const randomTopics = [
    {
        lines: [
            "今日は良い天気ですね",
            "洗濯物がよく乾きそうです",
            "お気に入りの服は何ですか"
        ]
    },
    {
        lines: [
            "最近お腹が空くのが早いです",
            "お昼ごはんを食べるのが楽しみです",
            "今日のお昼は何を食べたいですか"
        ]
    },
    {
        lines: [
            "昨日新しい本を買いました",
            "歴史小説でなかなか面白いです",
            "最近読んだ本でおすすめはありますか"
        ]
    },
    {
        lines: [
            "最近少しだけ早起きできています",
            "朝の空気は気持ちがいいですね",
            "あなたは朝型ですかそれとも夜型ですか"
        ]
    },
    {
        lines: [
            "今週末は映画を見ようと思っています",
            "久しぶりに映画館に行きたいです",
            "最近見た映画でおすすめはありますか"
        ]
    },
    {
        lines: [
            "お部屋の片付けをしようと思っています",
            "思った以上に時間がかかりそうです",
            "片付けのコツのようなものはありますか"
        ]
    },
    {
        lines: [
            "最近コーヒーをよく飲みます",
            "少し豆を変えてみようかなと思います",
            "あなたはコーヒーはお好きですか"
        ]
    },
    {
        lines: [
            "今日は仕事の合間に stretches をしています",
            "体を動かすと頭がすっきりします",
            "あなたは定期的に運動をしていますか"
        ]
    },
    {
        lines: [
            "昨晩友人と電話で話しました",
            "久しぶりに話せて楽しかったです",
            "最近友人と連絡を取りましたか"
        ]
    },
    {
        lines: [
            "新しいレシピを試してみようと思っています",
            "カレーを作ろうかなと考えています",
            "あなたは料理をするのは好きですか"
        ]
    },
    {
        lines: [
            "最近駅まで歩くようにしています",
            "少し運動不足を感じていました",
            "あなたは一日どのくらい歩いていますか"
        ]
    },
    {
        lines: [
            "今日は出社です",
            "電車で本を読もうと思います",
            "通勤時間はどのように過ごしていますか"
        ]
    },
    {
        lines: [
            "最近新しい音楽を見つけました",
            "ジャズを聴くことが増えました",
            "あなたはどんなジャンルの音楽が好きですか"
        ]
    },
    {
        lines: [
            "明日は少し雨が降るようです",
            "傘を持っていくのを忘れないようにします",
            "雨の日はどのように過ごすのが好きですか"
        ]
    },
    {
        lines: [
            "最近お昼寝をする習慣をつけました",
            "15分ほど寝ると午後も元気に働けます",
            "あなたは昼寝をすることはありますか"
        ]
    },
    {
        lines: [
            "今週は水曜日が待ち遠しいです",
            "好きな番組が放送されます",
            "週末は普段どのように過ごされていますか"
        ]
    },
    {
        lines: [
            "新しいカフェを見つけました",
            "コーヒーとケーキが美味しかったです",
            "あなたの行きつけのカフェはありますか"
        ]
    },
    {
        lines: [
            "最近日記を書いています",
            "一日の終わりにその日を振り返るのは良いですね",
            "あなたは日記をつける習慣はありますか"
        ]
    },
    {
        lines: [
            "今朝は道路が混んでいました",
            "少し時間に余裕を持って出て良かったです",
            "通勤や通学で困ったことはありますか"
        ]
    },
    {
        lines: [
            "最近図書館に行くことが増えました",
            "静かな環境で本を読むのは良いですね",
            "あなたは図書館をよく利用しますか"
        ]
    },
    {
        lines: [
            "昨日は久しぶりにジョギングをしました",
            "少し疲れましたが気持ちよかったです",
            "あなたはランニングをすることはありますか"
        ]
    },
    {
        lines: [
            "最近家計簿をつけています",
            "どこにお金が使われているのか把握したいです",
            "あなたは貯金の目標などはありますか"
        ]
    },
    {
        lines: [
            "今日はお腹が空きました",
            "お昼はラーメンを食べようと思います",
            "あなたはラーメンはお好きですか"
        ]
    },
    {
        lines: [
            "最近少し寒さを感じます",
            "コートを着ていくのが正解でした",
            "あなたは寒がりですかそれとも暑がりですか"
        ]
    },
    {
        lines: [
            "今週末はショッピングに行こうと思っています",
            "新しい服を買いたいです",
            "あなたは服選びは好きですか"
        ]
    },
    {
        lines: [
            "最近デジタルデトックスをしています",
            "寝る1時間前からスマホを見ないようにしています",
            "あなたは寝る前にスマホを見ますか"
        ]
    },
    {
        lines: [
            "昨日は家族と夕食を食べました",
            "久しぶりにみんなで集まることができました",
            "あなたは家族とよく会いますか"
        ]
    },
    {
        lines: [
            "最近ヨガを始めました",
            "体が柔らかくなると良いなと思います",
            "あなたはヨガやストレッチをしますか"
        ]
    },
    {
        lines: [
            "今日はリモートワークです",
            "集中して仕事ができるのは良いですね",
            "あなたは出社とリモート、どちらが好きですか"
        ]
    },
    {
        lines: [
            "最近植物を育てています",
            "観葉植物が部屋にあると癒やされます",
            "あなたは植物を育てたことはありますか"
        ]
    },
    {
        lines: [
            "昨日は久しぶりに友人と食事に行きました",
            "新しいイタリアンレストランを開店しました",
            "あなたはどんなジャンルのお店が好きですか"
        ]
    },
    {
        lines: [
            "最近少し早起きしようとしています",
            "朝の時間を有効活用したいです",
            "あなたは何時に起きるのが理想ですか"
        ]
    },
    {
        lines: [
            "今日は疲れました",
            "でも良い一日でした",
            "あなたは今日どのように過ごしましたか"
        ]
    },
    {
        lines: [
            "最近犬の散歩を手伝っています",
            "散歩コースを変えると犬も喜びます",
            "あなたは動物はお好きですか"
        ]
    },
    {
        lines: [
            "今週は忙しくなりそうです",
            "でも少しずつ進めていこうと思います",
            "あなたは忙しい時でもリラックスする方法はありますか"
        ]
    },
    {
        lines: [
            "最近写真を撮るのが楽しいです",
            "桜が綺麗に咲いています",
            "あなたは何の写真を撮るのが好きですか"
        ]
    },
    {
        lines: [
            "今日は久しぶりに実家に帰ります",
            "母の手料理が楽しみです",
            "あなたは実家にどのくらい帰りますか"
        ]
    },
    {
        lines: [
            "最近少し睡眠時間が短いです",
            "もっと寝るようにしようと思います",
            "あなたは一日何時間寝ていますか"
        ]
    },
    {
        lines: [
            "昨日は美味しいパン屋を見つけました",
            "クロワッサンが絶品でした",
            "あなたはパン派ですかそれともご飯派ですか"
        ]
    },
    {
        lines: [
            "最近新しい趣味を探しています",
            "何か面白いことないかなと思います",
            "あなたの趣味は何ですか"
        ]
    },
    {
        lines: [
            "今日は少し頭が痛いです",
            "早く帰ってゆっくりしたいと思います",
            "あなたは体調が悪い時はどうしていますか"
        ]
    },
    {
        lines: [
            "最近YouTubeを見る時間が増えました",
            "色々なクリエイターの動画を楽しんでいます",
            "あなたはよく見るYouTuberはいますか"
        ]
    },
    {
        lines: [
            "昨日は駅前の新しいカフェに行きました",
            "意外と空いていてゆっくりできました",
            "あなたは一人でカフェに行くことはありますか"
        ]
    },
    {
        lines: [
            "最近英語の勉強を再開しました",
            "久しぶりに単語を覚えています",
            "あなたは外国語を勉強したことはありますか"
        ]
    },
    {
        lines: [
            "今日は少し雨が降っています",
            "傘を忘れてきて少し濡れてしまいました",
            "あなたは今日の天気はどうでしたか"
        ]
    },
    {
        lines: [
            "最近古いアルバムを見返しました",
            "子供の頃の写真がたくさんありました",
            "あなたは子供の頃を思い出すことはありますか"
        ]
    },
    {
        lines: [
            "今週末は特別な予定はありません",
            "のんびり過ごそうと思います",
            "あなたは休みの日はどのように過ごすのが好きですか"
        ]
    },
    {
        lines: [
            "最近少しだけ早歩きをしています",
            "歩く速さが速いと目的地に早く着きます",
            "あなたは歩くのは好きですか"
        ]
    },
    {
        lines: [
            "昨日は美味しいラーメンを食べました",
            "新しいお店で替え玉ができるところでした",
            "あなたはラーメンはどのような味が好きですか"
        ]
    },
    {
        lines: [
            "最近ネットフリックスを見ています",
            "ドラマを一気見してしまいました",
            "あなたは最近見たドラマでおすすめはありますか"
        ]
    },
    {
        lines: [
            "今日は少し肌寒いです",
            "上着を持ってきてよかったです",
            "あなたは寒い日は何を着ていますか"
        ]
    }
];

// ランダムな話題を生成
function generateRandomResponse() {
    const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    return randomTopic.lines.join('\n');
}

// メッセージを表示
function addMessage(content, isUser) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    if (isUser) {
        messageContent.textContent = content;
    } else {
        // 複数行の場合、改行で分割して表示
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = line;
            if (index > 0) {
                lineDiv.style.marginTop = '8px';
            }
            messageContent.appendChild(lineDiv);
        });
    }

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // スクロールを一番下に
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// メッセージを送信
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const message = userInput.value.trim();

    if (!message) return;

    // 送信ボタンを無効化
    sendBtn.disabled = true;

    // ユーザーのメッセージを表示
    addMessage(message, true);
    userInput.value = '';

    // ボットの返答を生成（少し遅延を入れて自然に）
    setTimeout(() => {
        const response = generateRandomResponse();
        addMessage(response, false);
        sendBtn.disabled = false;
        userInput.focus();
    }, 500 + Math.random() * 500);
}

// イベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');

    // 送信ボタンクリック
    sendBtn.addEventListener('click', sendMessage);

    // Enterキーで送信
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // フォーカスを設定
    userInput.focus();
});
