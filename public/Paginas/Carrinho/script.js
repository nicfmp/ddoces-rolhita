document.addEventListener('DOMContentLoaded', () => {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const lista = document.getElementById('item-list');
  const totalList = document.querySelector('.total-list');

  lista.innerHTML = '';
  totalList.innerHTML = '';

  carrinho.forEach((produto, index) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <img src="${produto.imagem || 'https://placehold.co/100'}" alt="${produto.nome}" class="item-img" />
      <div class="item-info">
        <span class="item-title">${produto.nome}</span>
        <span class="item-subtitle">${produto.embalagem}</span>
        <button class="remove-btn" type="button" data-index="${index}">Remover</button>
      </div>
      <div class="qty-box">
        <button class="qty-decrease" aria-label="Diminuir">-</button>
        <span class="qty-value">${produto.quantidade}</span>
        <button class="qty-increase" aria-label="Aumentar">+</button>
      </div>
    `;
    lista.appendChild(li);

    totalList.innerHTML += `
      <li><span>${produto.nome}</span><span class="qnt-dez">${produto.quantidade * 10}</span></li>
    `;
  });

  updateTotalItems();

  // Aumentar quantidade
  document.querySelectorAll('.qty-increase').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      carrinho[i].quantidade += 1;
      salvarCarrinho(carrinho);
      location.reload();
    });
  });

  // Diminuir quantidade
  document.querySelectorAll('.qty-decrease').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (carrinho[i].quantidade > 1) {
        carrinho[i].quantidade -= 1;
        salvarCarrinho(carrinho);
        location.reload();
      }
    });
  });

  // Remover item
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      carrinho.splice(index, 1);
      salvarCarrinho(carrinho);
      location.reload();
    });
  });

  // Botão "Negociar"
  document.querySelector('.negotiate-btn').addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const produtos = carrinho.map(p => `- ${p.nome}`).join('\n');
    const mensagem = `Olá! Gostaria de negociar os seguintes produtos:\n\n${produtos}\n\nObrigado!`;

    const numeroWhatsApp = '5599999999999'; // Substitua com seu número no formato internacional
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

    alert('Se preferir, você também pode falar conosco pelo chat no canto da página.');
  });
});

function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function updateTotalItems() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  document.getElementById('total-items').textContent = `${total} Itens`;
  document.getElementById('header-items').textContent = `${total} Itens`;
}
