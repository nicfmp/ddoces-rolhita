document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('produtos-lista');
  const formBusca = document.querySelector('.search-form');
  const inputBusca = formBusca.querySelector('input[type="search"]');

  function carregarProdutos(url) {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        return res.json();
      })
      .then(produtos => {
        lista.innerHTML = '';

        if (produtos.length === 0) {
          lista.innerHTML = `
            <p style="color:red; font-weight:bold; font-size:20px;">
              Nenhum produto encontrado.
            </p>`;
          return;
        }

        produtos.forEach(produto => {
          const link = document.createElement('a');
          link.href = `/Paginas/Catálogo/Produtos/index.html?id=${produto.id}`;
          link.className = 'product-card';

          link.innerHTML = `
            <img src="https://placehold.co/400" alt="${produto.nome_produto}">
            <div class="product-info">
              <p>${produto.nome_produto}<br>${produto.embalagem}</p>
            </div>
          `;

          lista.appendChild(link);
        });
      })
      .catch(error => {
        console.error('Erro:', error);
        lista.innerHTML = `
          <p style="color:red; font-weight:bold; font-size:20px;">
            Erro ao carregar os produtos.
          </p>`;
      });
  }

  // Carregar todos os produtos no início
  carregarProdutos('http://localhost:3000/produtos');

  // Evento do formulário de busca
  formBusca.addEventListener('submit', e => {
    e.preventDefault();
    const termo = inputBusca.value.trim();

    if (termo === '') {
      carregarProdutos('http://localhost:3000/produtos');
    } else {
      carregarProdutos(`http://localhost:3000/buscar?q=${encodeURIComponent(termo)}`);
    }
  });
});
