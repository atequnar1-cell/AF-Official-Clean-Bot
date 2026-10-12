const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');

app.get('/', (req,res)=> res.send('AF Official Clean Bot is LIVE ✅ No Hack, No Wrong Content'));

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({ logger: P({level:'silent'}), auth: state, printQRInTerminal: true });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u)=>{
    if(u.connection==='close' && u.lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut) startBot();
    if(u.connection==='open') console.log('AF Clean Bot Connected!');
  });
  sock.ev.on('messages.upsert', async (m)=>{
    const msg = m.messages[0];
    if(!msg.message || msg.key.fromMe) return;
    const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase();
    const from = msg.key.remoteJid;
    let reply = '';
    if(text.includes('salam') || text.includes('hi') || text.includes('hello')){
      reply = 'Walaikum Salam! 👋 AF Official me khush amdeed!\n\n1. Price\n2. Services\n3. Contact';
    } else if(text.includes('price')){
      reply = '💰 AF Official Services:\nWebsite: 5000 PKR\nWhatsApp Bot: 4000 PKR\n\nClean & Halal Work ✅';
    } else if(text.includes('service')){
      reply = 'Hum Website aur Auto-Reply Bot banate hain. 100% clean work, koi hack nahi.';
    } else {
      reply = 'JazakAllah! AF Official team jald reply karegi. 🙏';
    }
    await sock.sendMessage(from, {text: reply});
  });
}
startBot();
app.listen(process.env.PORT || 3000);
