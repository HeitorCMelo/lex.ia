const urlProcessos = "http://localhost:3000/api/processos";
let token = "";
let tbody ; 


async function gerarToken() {
    const response = await fetch("http://localhost:3000/api/token");
    const data = await response.json();
    return data.token;
}


async function Pesquisar() {
    token = await gerarToken();

    const cpfCnpj = document.getElementById("cpfCnpj").value.trim();
    document.getElementById("documento").textContent = "CPF/CNPJ procurado: " + cpfCnpj;

    const response = await fetch(urlProcessos, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify({ cpfCnpj })
    });

    const dados = await response.json();
    processos = dados.data?.content ;
    document.getElementById("TotalProcessos").textContent = "Número de Processos: " + processos.length;

    const container = document.getElementById("dados");
    container.innerHTML = "";

    const tabela = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    const thNumero = document.createElement("th");
    thNumero.textContent = "Numero" ;
    trHead.appendChild(thNumero);

    const thTribunal = document.createElement("th");
    thTribunal.textContent = "Tribunal";
    trHead.appendChild(thTribunal);

    const thAssunto = document.createElement("th");
    thAssunto.textContent = "Assunto";
    trHead.appendChild(thAssunto);
    thead.appendChild(trHead);
    tabela.appendChild(thead); 

    tbody = document.createElement("tbody");
    
    processos.forEach(processo => {
        const tr = document.createElement("tr");
        const tdNumero = document.createElement("td");
        tdNumero.textContent = processo.numeroProcesso ; 
        tr.appendChild(tdNumero);
        
        const tdTribunal  = document.createElement("td");
        tdTribunal.textContent = processo.siglaTribunal ; 
        tr.appendChild(tdTribunal);

        const tdSituacao = document.createElement("td");
        tdSituacao.textContent = processo.ativo ? "Ativo" : "Inativo";
        tr.appendChild(tdSituacao);

        const tdAssunto = document.createElement("td");
        const assunto = processo.tramitacoes[0].assunto[0];
       tdAssunto.innerHTML = 
        `Código: ${assunto.codigo}<br>` +
        `Descrição: ${assunto.descricao}<br>` +
        `Hierarquia: ${assunto.hierarquia}`;
        tr.appendChild(tdAssunto)
        tbody.appendChild(tr);
        const tdBotao = document.createElement("td");
        const botao = document.createElement("button");
        botao.textContent = "Abrir"; 
        tdBotao.appendChild(botao);
        tr.appendChild(tdBotao);
        botao.addEventListener("click", () => {
   
        localStorage.setItem("processoSelecionado", JSON.stringify(processo));
         window.location.href = "detalhes.html";
});
    });

    tabela.appendChild(tbody);
    container.appendChild(tabela);

    
}

const selectDireitos = document.getElementById("selectDireitos");

selectDireitos.addEventListener('change', () => {
    if (!tbody) return; // nada a fazer se a tabela ainda não existe
    const valorSelecionado = selectDireitos.value.toLowerCase();
    const linhas = tbody.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const conteudo = linhas[i].innerText.toLowerCase();
        linhas[i].style.display = valorSelecionado === "" || conteudo.includes(valorSelecionado) ? '' : 'none';
    }
});



