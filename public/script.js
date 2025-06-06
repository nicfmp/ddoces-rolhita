const track = document.getElementById("carrossel-track");
let currentScroll = 0;

function getItemWidth() {
  const item = track.querySelector(".imagem-carrossel");
  const style = window.getComputedStyle(item);
  const width = item.offsetWidth;
  const gap = parseInt(style.marginRight || 0); // caso use margem em vez de gap
  return width + 130; // 130 é o gap do CSS
}

function getVisibleItems() {
  const width = window.innerWidth;
  if (width <= 480) return 1;
  if (width <= 768) return 2;
  return 3;
}

function moveCarrossel(direction) {
  const itemWidth = getItemWidth();

  const containerWidth = track.parentElement.offsetWidth;
  const contentWidth = track.scrollWidth;
  const maxScroll = contentWidth - containerWidth;

  currentScroll += direction * itemWidth;

  if (currentScroll > maxScroll) {
    currentScroll = 0;
  } else if (currentScroll < 0) {
    currentScroll = maxScroll;
  }

  track.style.transform = `translateX(-${currentScroll}px)`;
}


window.addEventListener("resize", () => {
  currentScroll = 0; // reseta para evitar bug
  moveCarrossel(0);
});

fetch('/produtos')
  .then(res => res.json())
  .then(produtos => {
    const lista = document.getElementById('lista-produtos');
    produtos.forEach(prod => {
      const item = document.createElement('li');
      item.textContent = `${prod.nome_produto} (${prod.embalagem})`;
      lista.appendChild(item);
    });
  })
  .catch(err => console.error('Erro ao carregar produtos:', err));
