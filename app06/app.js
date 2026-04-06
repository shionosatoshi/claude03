// 会話履歴を保持
let conversationHistory = [];

// ポジティブな返答テンプレート
const responseTemplates = {
    greeting: [
        "こんにちは！今日はどのようなお話をしましょう",
        "はい！いつでもお話しに乗りますよ",
        "こんにちは！元気そうですね"
    ],
    thanks: [
        "どういたしまして！またいつでも聞いてくださいね",
        "こちらこそ、ありがとうございます",
        "嬉しいです！お役に立てて光栄です"
    ],
    sad: [
        "大丈夫ですね、あなたなら乗り越えられますよ",
        "辛い時こそ、自分を信じてくださいね",
        "きっと良くなります。無理しないでください"
    ],
    worried: [
        "まずは一歩ずつ考えていきましょう",
        "不安な気持ち、分かりますよ。大丈夫です",
        "あなたならきっと良い解決策が見つかります"
    ],
    tired: [
        "お疲れ様です。今日も頑張りましたね",
        "休むことも大切な作業ですよ",
        "ゆっくり休んでくださいね"
    ],
    happy: [
        "それは素晴らしいですね！",
        "嬉しいお話を聞かせてくれてありがとう",
        "その調子です！素敵ですね"
    ],
    agreement: [
        "そうですね、良い考えだと思います",
        "確かにそうですね",
        "その通りですね！素敵な視点です"
    ],
    encouragement: [
        "応援していますよ！",
        "あなたならきっとできますよ",
        "挑戦してみる価値がありそうですね"
    ],
    interest: [
        "それは興味深いですね",
        "詳しく聞かせてくれませんか",
        "面白い話題ですね"
    ]
};

// メッセージからキーワードを抽出
function extractKeywords(message) {
    const keywords = [];

    // 主語・重要名詞のパターン
    const patterns = {
        '仕事': /仕事|業務|職場|オフィス/i,
        '勉強': /勉強|学習|宿題|試験|テスト/i,
        '家族': /家族|母|父|兄弟|姉妹|親/i,
        '友達': /友達|友人|仲間|フレンド/i,
        '健康': /健康|体調|病気|怪我|体/i,
        'お金': /お金|給料|貯金|料金/i,
        '天気': /天気|雨|晴れ|雪/i,
        '趣味': /趣味|遊び|ゲーム|スポーツ/i,
        '将来': /将来|未来|夢|目標|願望/i,
        '恋愛': /恋愛|彼女|彼氏|好き|愛/i,
        '旅行': /旅行|出張|温泉|観光|旅/i,
        '食べ物': /ご飯|食事|料理|レストラン/i,
        '昨日': /昨日|きのう/i,
        '今日': /今日|きょう|本日/i,
        '明日': /明日|あした/i,
        '週末': /週末|土日|休み/i
    };

    for (const [keyword, pattern] of Object.entries(patterns)) {
        if (pattern.test(message)) {
            keywords.push(keyword);
        }
    }

    return keywords;
}

// 感情・意図を検出
function detectIntent(message) {
    const lowerMessage = message.toLowerCase();

    if (/(こんにちは|こんばんは|おはよう|やあ|hi|hello)/i.test(lowerMessage)) {
        return 'greeting';
    }
    if (/(ありがとう|サンキュ|感謝|thx|thanks)/i.test(lowerMessage)) {
        return 'thanks';
    }
    if (/(辛い|悲しい|しんどい|つらい|泣ける|めげる|凹む)/i.test(lowerMessage)) {
        return 'sad';
    }
    if (/(不安|心配|悩み|悩む|迷う|どうしよう|困った)/i.test(lowerMessage)) {
        return 'worried';
    }
    if (/(疲れた|しんどい|お疲れ|くたびれた|疲れ)/i.test(lowerMessage)) {
        return 'tired';
    }
    if (/(嬉しい|楽しい|幸せ|happy|ワクワク|興奮|やった)/i.test(lowerMessage)) {
        return 'happy';
    }
    if (/(だよね|よね|そうだよね)/i.test(lowerMessage)) {
        return 'agreement';
    }
    if (/(したい|やりたい|目指す|頑張る|頑張ろう)/i.test(lowerMessage)) {
        return 'encouragement';
    }

    return 'interest';
}

// 文脈に基づいて返答を生成
function generateContextualResponse(message, intent, keywords) {
    // 返答テンプレートを選択
    let templates = responseTemplates[intent] || responseTemplates.interest;
    let baseResponse = templates[Math.floor(Math.random() * templates.length)];

    // キーワードを使って返答をカスタマイズ
    if (keywords.length > 0) {
        const keyword = keywords[0];

        // キーワードに応じた追加の返答
        const keywordResponses = {
            '仕事': ['仕事は頑張っていますか', '仕事の話、聞かせてください', '職場はどうですか'],
            '勉強': ['勉強順調ですか', '頑張ってくださいね', '何を勉強しているんですか'],
            '家族': ['家族は大切ですよね', 'お家のみなさんは元気ですか', '家族との時間、素敵ですね'],
            '友達': ['友達との時間、楽しみですね', '友人との関係、大切にしてくださいね'],
            '健康': ['お体に気をつけてくださいね', '健康第一ですよ', '体調、大丈夫ですか'],
            'お金': ['お金の話、大切ですよね', '貯金、頑張っていますか'],
            '天気': ['天気、気になりますよね', '今日は良い天気ですか'],
            '趣味': ['趣味、素敵ですね', 'リフレッシュ大切ですよ'],
            '将来': ['将来のこと、考える素晴らしいですね', '夢に向かって頑張ってください'],
            '恋愛': ['恋愛、素敵ですね', '素敵な出会いがありますように'],
            '旅行': ['旅行、楽しみですね', 'リフレッシュできて素晴らしいです'],
            '食べ物': ['美味しいもの、食べてくださいね', '食事、大切ですよね'],
            '昨日': ['昨日はどうでしたか', '昨日はお疲れ様でした'],
            '今日': ['今日はどう過ごされますか', '今日も一日頑張ってください'],
            '明日': ['明日も頑張ってくださいね', '明日の予定はどうですか'],
            '週末': ['週末、楽しんできてくださいね', '週末の予定はありますか']
        };

        if (keywordResponses[keyword]) {
            const additionalResponse = keywordResponses[keyword][Math.floor(Math.random() * keywordResponses[keyword].length)];
            baseResponse += '。' + additionalResponse;
        }
    }

    // 会話履歴を使って文脈を考慮
    if (conversationHistory.length >= 2) {
        const previousKeywords = conversationHistory[conversationHistory.length - 2].keywords;

        // 前の話題とキーワードが被っている場合、関連した返答を追加
        if (keywords.length > 0 && previousKeywords.length > 0) {
            const matchingKeyword = keywords.find(k => previousKeywords.includes(k));
            if (matchingKeyword) {
                const contextResponses = [
                    `その${matchingKeyword}のこと、もっと聞かせてください`,
                    `そうですね、${matchingKeyword}は大切ですよね`,
                    `${matchingKeyword}について、詳しく教えてください`
                ];
                baseResponse = contextResponses[Math.floor(Math.random() * contextResponses.length)];
            }
        }
    }

    // 質問文には返答を
    if (/(ですか|ますか|したの|どう|何)/i.test(message) && !baseResponse.includes('ですか')) {
        const questionResponses = [
            ' あなたはどう思いますか',
            ' 詳しく教えてください',
            ' どのような点でそう思われますか'
        ];
        baseResponse += questionResponses[Math.floor(Math.random() * questionResponses.length)];
    }

    return baseResponse;
}

// メッセージを表示
function addMessage(content, isUser) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

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

    // キーワード抽出と意図検出
    const keywords = extractKeywords(message);
    const intent = detectIntent(message);

    // 会話履歴に追加
    conversationHistory.push({
        message: message,
        keywords: keywords,
        intent: intent
    });

    // 履歴が長すぎたら古いものを削除（最大10件）
    if (conversationHistory.length > 10) {
        conversationHistory.shift();
    }

    userInput.value = '';

    // ボットの返答を生成（少し遅延を入れて自然に）
    setTimeout(() => {
        const response = generateContextualResponse(message, intent, keywords);
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
