// ポジティブな返答パターン
const positiveResponses = {
    greeting: [
        "こんにちは！あなたに会えて嬉しいです！✨",
        "やあ！元気そうで何よりです！😊",
        "こんにちは！素敵一日になりますように！🌟"
    ],
    thanks: [
        "どういたしまして！あなたのお役に立てて光栄です！💫",
        "嬉しいです！また何でも聞いてくださいね！😄",
        "こちらこそありがとうございます！あなたの笑顔が見られて嬉しいです！✨"
    ],
    sad: [
        "大丈夫ですよ！あなたは強いんです！💪",
        "辛い時もありますよね。でもきっと良くなります！🌈",
        "あなたなら乗り越えられます！応援しています！💖",
        "今は休むのも大切ですね。無理しないでくださいね！😊"
    ],
    worried: [
        "不安な気持ち、分かります。でも大丈夫！あなたならできる！💫",
        "一歩ずつ進めば大丈夫！応援しています！✨",
        "悩みがあるということは、あなたは真剣なんですね！素晴らしいです！🌟"
    ],
    tired: [
        "お疲れ様です！今日も頑張りましたね！😊",
        "休むことも立派な作業です！ゆっくり休んでくださいね！💤",
        "あなたの努力、認めてあげてくださいね！✨"
    ],
    happy: [
        "それは素晴らしい！あなたの笑顔がここまで届きます！😄",
        "嬉しいですね！その幸せがずっと続きますように！🌟",
        "あなたの幸せな姿、想像するだけでこっちまで嬉しいです！✨"
    ],
    question: [
        "良い質問ですね！肯定的に捉えれば、きっと良い答えが見つかります！💡",
        "興味深いですね！あなたの探究心、素晴らしいです！🌟",
        "考えさせる質問です！あなたなら素晴らしい解決策が見つかりますよ！✨"
    ],
    default: [
        "なるほどね！あなたの視点、素敵ですね！😊",
        "へえ、そうなんだ！面白いですね！✨",
        "分かりました！あなたの考え、前向きで素晴らしいです！💫",
        "そういう考えもあるんですね！勉強になります！🌟",
        "あなたとの会話、いつも刺激されます！😄",
        "ポジティブに考えれば、きっとチャンスです！💪",
        "あなたの言葉、力をもらいました！ありがとうございます！✨",
        "素敵な話ですね！もっと聞かせてください！😊"
    ]
};

// キーワードに基づいてカテゴリを判定
function detectCategory(message) {
    const lowerMessage = message.toLowerCase();

    if (/(こんにちは|こんばんは|おはよう|やあ|こんにちは|hi|hello|やほー)/i.test(lowerMessage)) {
        return 'greeting';
    }
    if (/(ありがとう|サンキュ|感謝|thx|thanks)/i.test(lowerMessage)) {
        return 'thanks';
    }
    if (/(辛い|悲しい|しんどい|つらい|泣ける|めげる|凹む)/i.test(lowerMessage)) {
        return 'sad';
    }
    if (/(不安|心配|悩み|悩む|迷う|どうしよう)/i.test(lowerMessage)) {
        return 'worried';
    }
    if (/(疲れた|しんどい|お疲れ|くたびれた|疲れた)/i.test(lowerMessage)) {
        return 'tired';
    }
    if (/(嬉しい|楽しい|幸せ|happy|ワクワク|興奮)/i.test(lowerMessage)) {
        return 'happy';
    }
    if (/(どう思う|どうすれば|どうやって|教えて|？|\?)/i.test(lowerMessage)) {
        return 'question';
    }

    return 'default';
}

// ランダムに返答を選択
function getRandomResponse(category) {
    const responses = positiveResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
}

// ポジティブな返答を生成
function generatePositiveResponse(userMessage) {
    const category = detectCategory(userMessage);
    return getRandomResponse(category);
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
    userInput.value = '';

    // ボットの返答を生成（少し遅延を入れて自然に）
    setTimeout(() => {
        const response = generatePositiveResponse(message);
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
