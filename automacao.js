const puppeteer = require("puppeteer");
const fs = require("fs");

async function fazerConsulta() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(
      "https://www.julianocaju.com.br/calculadora-cpu/?cc=BRL&ce=0&rp=252&cr=atual&g57=2"
    );

    await page.waitForSelector("#m21rb");

    await page.evaluate(() => {
      const elemento = document.querySelector("#tabcalccpu");
      elemento.childNodes[1].childNodes[1].childNodes[13].click();
    });

    await page.waitForTimeout(10000);

    const moeda = await page.evaluate(() => {
      const elemento = document.querySelector("#tabcalccpu");
      return elemento.childNodes[3].childNodes[0].childNodes[1].innerText;
    });

    const valores = await page.evaluate(() => {
      const elemento = document.querySelector("#tabcalccpu");
      return elemento.childNodes[3].childNodes[0].childNodes[13].innerText;
    });

    console.log("Moeda:", moeda);
    console.log("Valores:", valores);

    const dataAtual = new Date();

    const ano = dataAtual.getFullYear();
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0"); // Adiciona zero à esquerda, se necessário
    const dia = dataAtual.getDate().toString().padStart(2, "0");
    const dataFormatada = `${ano}-${mes}-${dia}`;
    const dataAtualStr = dataAtual.toLocaleString();
    const novoLog = `Moeda: ${moeda}\nValores: ${valores}\nData/Hora: ${dataAtualStr}\n\n`;
    const dadosToday = `dados-${dataFormatada}.txt`;

    let conteudoAtual = "";
    if (fs.existsSync(dadosToday)) {
      conteudoAtual = fs.readFileSync(dadosToday, "utf-8");
    }
    conteudoAtual += novoLog;

    fs.writeFileSync(dadosToday, conteudoAtual);

    console.log("Log adicionado ao arquivo " + dadosToday + ".");
  } catch (error) {
    console.error("Erro ao coletar dados:", error);
  } finally {
    await browser.close();
  }
}

fazerConsulta();

setInterval(fazerConsulta, 600000 );
