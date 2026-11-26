// Cloudflare Worker. Set BOT_TOKEN and WEBHOOK_SECRET as secrets.
export default {
 async fetch(request, env) {
  if(request.method !== 'POST') return new Response('OK');
  if(!env.BOT_TOKEN || !env.WEBHOOK_SECRET || request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.WEBHOOK_SECRET) return new Response('Forbidden',{status:403});
  const update=await request.json();
  const msg=update.message;
  if(msg?.chat?.type==='private' && /^\/start(?:@moy_prikorm_bot)?(?:\s|$)/i.test(msg.text||'')){
   const response=await fetch('https://api.telegram.org/bot'+env.BOT_TOKEN+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:msg.chat.id,text:'Привет! 🧡\n\n«Мой прикорм» — уютное пространство для первых вкусов и маленьких открытий твоего малыша.\n\n🥦 Трекер первых продуктов\n🥚 Знакомство с аллергенами\n🍲 Рецепты для малышей\n📒 Дневник питания и реакций\n📅 Календарь прикорма\n\nКаждая ложечка — новое открытие!\n\nНачнём это вкусное путешествие вместе? 🥄',reply_markup:{inline_keyboard:[[{text:'Начать прикорм 🧡',web_app:{url:'https://jombaek.github.io/moy-prikorm/'}}]]}})});
   if(!response.ok) return new Response('Telegram request failed',{status:502});
  }
  return new Response('OK');
 }
};