window.onload = function () {
  const cards = document.querySelectorAll('.card');
  const dots = document.querySelectorAll('.dot');
  const sliderTrack = document.querySelector('.slider-container');

  let currentIndex = 0;
  let autoSlideInterval;

  function updateSlider() {
    cards.forEach((card, index) => {
      card.classList.remove('active', 'prev-card', 'next-card');
      if (index === currentIndex) {
        card.classList.add('active');
      } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
        card.classList.add('prev-card');
      } else if (index === (currentIndex + 1) % cards.length) {
        card.classList.add('next-card');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateSlider();
    }, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // 카드 호버 시 멈춤
  cards.forEach((card) => {
    card.addEventListener('mouseenter', stopAutoSlide);
    card.addEventListener('mouseleave', startAutoSlide);
  });

  // 인디케이터 호버 시 멈춤 및 클릭 이벤트
  dots.forEach((dot) => {
    dot.addEventListener('mouseenter', stopAutoSlide);
    dot.addEventListener('mouseleave', startAutoSlide);
    dot.addEventListener('click', () => {
      currentIndex = parseInt(dot.getAttribute('data-index'));
      updateSlider();
    });
  });

  // 드래그/터치 로직
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  const dragThreshold = 60;

  function onDragStart(e) {
    stopAutoSlide();
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
    currentTranslate = currentX - startX;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    if (currentTranslate < -dragThreshold) {
      currentIndex = (currentIndex + 1) % cards.length;
    } else if (currentTranslate > dragThreshold) {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    }

    updateSlider();
    currentTranslate = 0;
    startAutoSlide();
  }

  const track = document.querySelector('.slider-track');
  track.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  track.addEventListener('touchstart', onDragStart, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: true });
  window.addEventListener('touchend', onDragEnd);

  updateSlider();
  startAutoSlide();
};
