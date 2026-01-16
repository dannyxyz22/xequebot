// atualizarSupabase.js
import puppeteer from "puppeteer";

async function atualizarSupabase() {
  console.log("Abrindo navegador virtual...");
  const browser = await puppeteer.launch({
    headless: true, // defina como false para depurar visualmente
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  console.log("Acessando o site...");
  await page.goto("https://ita-chess-champs.lovable.app/", {
    waitUntil: "domcontentloaded", // espera o carregamento completo
    timeout: 100000
  });

  // Aguarda algum seletor visível que indique que o JS foi executado
  // (ajuste conforme seu site)
 // await page.waitForTimeout(5000); // 5 segundos para o script rodar

    console.log("Aguardando o script do site atualizar o Supabase...");
    await new Promise(r => setTimeout(r, 60000));

  console.log("Página carregada e scripts executados.");

  // (Opcional) Verifica no console do navegador mensagens ou erros
  page.on("console", msg => console.log("Browser log:", msg.text()));

  await browser.close();
  console.log("Supabase atualizado com sucesso!");
}

atualizarSupabase().catch(console.error);
