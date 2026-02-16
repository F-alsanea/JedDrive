
export async function getAICarAdvice(message: string, language: 'ar' | 'en'): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        return language === 'ar' ? 'عذراً، مفتاح الـ API غير متوفر حالياً.' : 'Sorry, API key is not configured.';
    }

    const systemPrompt = language === 'ar'
        ? "أنت 'خبير جيد درايف' (JedDrive AI Mechanic)، مساعد ذكي متخصص في السيارات في مدينة جدة. ساعد المستخدم في تشخيص مشاكل سيارته، أعطه نصائح صيانة، واقترح عليه نوع الخدمة المناسبة (ورشة صيانة، مغسلة، سطح، أو زينة). اجعل أسلوبك ودوداً واحترافياً واستخدم اللهجة السعودية البيضاء قليلاً."
        : "You are the 'JedDrive AI Mechanic', a smart car assistant in Jeddah. Help users diagnose car issues, give maintenance tips, and suggest appropriate service categories (Repair, Wash, Tow, or Tinting). Be professional, helpful, and friendly.";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || (language === 'ar' ? 'عذراً، لم أستطع فهم ذلك.' : 'Sorry, I couldn\'t understand that.');
    } catch (error) {
        console.error('AI Error:', error);
        return language === 'ar' ? 'حدث خطأ في الاتصال بالذكاء الاصطناعي.' : 'Error connecting to the AI assistant.';
    }
}
