document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const produtoId = params.get('id');
  let produtoAtual = null;

  if (!produtoId) return;

  // Buscar os dados do produto
  fetch(`/produtos/${produtoId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Produto não encontrado: ${response.status}`);
      }
      return response.json();
    })
    .then(produto => {
      produtoAtual = produto;

      // Preencher os elementos com os dados do produto
      document.getElementById('produto-nome').innerText = produto.nome_produto;
      document.getElementById('produto-embalagem').innerText = produto.embalagem;
      document.getElementById('produto-descricao').innerText = produto.descricao || '';

      const img = document.getElementById('produto-imagem');
      if (produto.imagem_url) {
        img.src = produto.imagem_url;
        img.alt = produto.nome_produto;
        img.style.display = 'block';
      } else {
        img.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Erro ao carregar produto:', error);
      document.querySelector('.product-info').innerHTML = '<p style="color:red;">Erro ao carregar o produto.</p>';
    });

  // Lidar com botão de adicionar ao carrinho
  const botaoCarrinho = document.querySelector('.cart-btn');
  if (botaoCarrinho) {
    botaoCarrinho.addEventListener('click', () => {
      if (!produtoAtual) return;

      let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

      // Verifica se o produto já está no carrinho
      const existente = carrinho.find(item => item.id === produtoAtual.id);
      if (existente) {
        existente.quantidade += 1;
      } else {
        carrinho.push({
          id: produtoAtual.id,
          nome: produtoAtual.nome_produto,
          embalagem: produtoAtual.embalagem,
          imagem: produtoAtual.imagem_url,
          quantidade: 1
        });
      }

      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      alert('Produto adicionado ao carrinho!');
    });
  }
});
