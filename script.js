let graficoJuros, graficoSaldo, graficoParcelas;

function calcularSAC(valor, parcelas, juros) {
  valor = parseFloat(valor);
  parcelas = parseInt(parcelas);
  juros = parseFloat(juros) / 100;

  const amortizacao = valor / parcelas;
  const resultado = [];

  let saldo = valor;

  for (let i = 0; i < parcelas; i++) {
    const jurosMes = saldo * juros;
    const parcela = amortizacao + jurosMes;
    saldo -= amortizacao;

    resultado.push({
      amortizacao: amortizacao.toFixed(2),
      juros: jurosMes.toFixed(2),
      parcela: parcela.toFixed(2),
      saldo: saldo > 0 ? saldo.toFixed(2) : "0.00"
    });
  }

  return resultado;
}

function calcularParcelaFixa(valor, juros, parcelaFixa) {
  valor = parseFloat(valor);
  juros = parseFloat(juros) / 100;
  parcelaFixa = parseFloat(parcelaFixa);

  const resultado = [];
  let saldo = valor;
  let i = 0;

  while (saldo > 0 && i < 1000) {
    const jurosMes = saldo * juros;
    let amortizacao = parcelaFixa - jurosMes;
    if (amortizacao > saldo) amortizacao = saldo;
    const parcela = amortizacao + jurosMes;
    saldo -= amortizacao;

    resultado.push({
      amortizacao: amortizacao.toFixed(2),
      juros: jurosMes.toFixed(2),
      parcela: parcela.toFixed(2),
      saldo: saldo > 0 ? saldo.toFixed(2) : "0.00"
    });

    i++;
  }

  return resultado;
}

function destruirGraficos() {
  graficoJuros?.destroy();
  graficoSaldo?.destroy();
  graficoParcelas?.destroy();
}

document.getElementById('calcular').addEventListener('click', () => {
  const valor = document.getElementById('valor').value;
  const juros = document.getElementById('juros').value;
  const parcelas = document.getElementById('parcelas').value;
  const parcelaFixa = document.getElementById('parcelaFixa').value;

  if (!valor || !juros || !parcelas || !parcelaFixa) {
    alert("Preencha todos os campos!");
    return;
  }

  const sac = calcularSAC(valor, parcelas, juros);
  const fixa = calcularParcelaFixa(valor, juros, parcelaFixa);

  const tbody = document.querySelector('#resultado tbody');
  tbody.innerHTML = '';

  const maxMeses = Math.max(sac.length, fixa.length);

  let totalJurosSAC = 0;
  let totalJurosFixa = 0;
  const labels = [];
  const saldoSAC = [], saldoFixa = [];
  const jurosSAC = [], jurosFixa = [];
  const parcelasSAC = [], parcelasFixa = [];

  for (let i = 0; i < maxMeses; i++) {
    const f = fixa[i] || { amortizacao: '-', juros: '-', parcela: '-', saldo: '-' };
    const s = sac[i] || { amortizacao: '-', juros: '-', parcela: '-', saldo: '-' };

    if (f.juros !== '-') totalJurosFixa += parseFloat(f.juros);
    if (s.juros !== '-') totalJurosSAC += parseFloat(s.juros);

    saldoFixa.push(f.saldo !== '-' ? parseFloat(f.saldo) : null);
    saldoSAC.push(s.saldo !== '-' ? parseFloat(s.saldo) : null);

    jurosFixa.push(f.juros !== '-' ? parseFloat(f.juros) : null);
    jurosSAC.push(s.juros !== '-' ? parseFloat(s.juros) : null);

    parcelasFixa.push(f.parcela !== '-' ? parseFloat(f.parcela) : null);
    parcelasSAC.push(s.parcela !== '-' ? parseFloat(s.parcela) : null);

    labels.push(`M${i + 1}`);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>R$ ${f.juros}</td>
      <td>R$ ${f.amortizacao}</td>
      <td>R$ ${f.parcela}</td>
      <td>R$ ${f.saldo}</td>
      <td>R$ ${s.juros}</td>
      <td>R$ ${s.amortizacao}</td>
      <td>R$ ${s.parcela}</td>
      <td>R$ ${s.saldo}</td>
    `;
    tbody.appendChild(row);
  }

  const anosSAC = (sac.length / 12).toFixed(1);
  const anosFixa = (fixa.length / 12).toFixed(1);

  document.getElementById('sacResumo').innerText =
    `Total de juros: R$ ${totalJurosSAC.toFixed(2)}, Duração: ${sac.length} meses (~${anosSAC} anos)`;

  document.getElementById('fixaResumo').innerText =
    `Total de juros: R$ ${totalJurosFixa.toFixed(2)}, Duração: ${fixa.length} meses (~${anosFixa} anos)`;

  destruirGraficos();

  graficoJuros = new Chart(document.getElementById('graficoJuros').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Juros SAC', data: jurosSAC, borderColor: '#e67e22', fill: false },
        { label: 'Juros Parcela Fixa', data: jurosFixa, borderColor: '#e74c3c', fill: false }
      ]
    }
  });

  graficoSaldo = new Chart(document.getElementById('graficoSaldo').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Saldo SAC', data: saldoSAC, borderColor: '#3498db', fill: false },
        { label: 'Saldo Parcela Fixa', data: saldoFixa, borderColor: '#9b59b6', fill: false }
      ]
    }
  });

  graficoParcelas = new Chart(document.getElementById('graficoParcelas').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Parcela SAC', data: parcelasSAC, borderColor: '#2ecc71', fill: false },
        { label: 'Parcela Fixa', data: parcelasFixa, borderColor: '#f1c40f', fill: false }
      ]
    }
  });
});
