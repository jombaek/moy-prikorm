// Cloudflare Worker. Set BOT_TOKEN and WEBHOOK_SECRET as secrets.
export default {
 async fetch(request, env) {
  if(new URL(request.url).pathname === '/setup') {
   if(request.method !== 'POST' || !env.WEBHOOK_SECRET || !env.BOT_TOKEN) return new Response('Forbidden',{status:403});
   const form=await request.formData();
   if(form.get('secret') !== env.WEBHOOK_SECRET) return new Response('Forbidden',{status:403});
   const res=await fetch('https://api.telegram.org/bot'+env.BOT_TOKEN+'/setWebhook',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:new URL(request.url).origin+'/',secret_token:env.WEBHOOK_SECRET,allowed_updates:['message']})});
   const result=await res.json();
   return new Response(result.ok?'Webhook connected!':'Webhook setup failed',{status:result.ok?200:502});
  }
  if(new URL(request.url).pathname === '/connect' && request.method === 'GET') return new Response('<!doctype html><html lang="ru"><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"><title>Подключение бота</title><body style="font:18px system-ui;padding:24px;background:#fff8f3"><h2>Мой прикорм</h2><form method="post" action="/setup"><label>WEBHOOK_SECRET<br><input type="password" name="secret" required autocomplete="off" style="font-size:18px;width:95%;padding:10px"></label><p><button style="padding:12px;font-size:18px">Подключить Telegram</button></p></form></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
  if(request.method !== 'POST') return new Response('Мой прикорм — бот работает!');
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