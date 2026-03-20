document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. 공통 스크롤 함수 (부드러운 스크롤 애니메이션)
  // =========================================================
  function smoothScroll(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, startPosition + distance * ease);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }

  // 커스텀 요소 스크롤 함수 (쇼츠 전용)
  function smoothScrollBy(element, targetScrollLeft, duration) {
    const startScrollLeft = element.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      element.scrollLeft = startScrollLeft + distance * ease;
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }

  // =========================================================
  // 2. 네비게이션 클릭 이벤트 (href 속성 기반 자동 매칭으로 개선)
  // =========================================================
  document.querySelectorAll('.gnb a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      // '#'으로 시작하는 앵커 링크일 경우만 작동 (상위 메뉴 껍데기 링크 '#' 제외)
      if (targetId && targetId.startsWith('#') && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
          smoothScroll(targetTop, 500);
        }
      }
    });
  });

  // =========================================================
  // 2.5 하위 메뉴 토글 기능 (모바일 터치 대응)
  // =========================================================
  const submenuToggle = document.querySelector('.submenu-toggle');

  if (submenuToggle) {
    submenuToggle.addEventListener('click', (e) => {
      e.preventDefault(); // 상위 메뉴 클릭 시 화면이 위로 튕기는 현상 방지

      const parentLi = submenuToggle.parentElement;
      // open 클래스를 넣었다 뺐다 하면서 하위 메뉴를 보여주고 숨김
      parentLi.classList.toggle('open');
    });

    // 화면의 다른 곳을 터치하면 열려있던 하위 메뉴 닫기
    document.addEventListener('click', (e) => {
      if (!submenuToggle.contains(e.target) && !submenuToggle.parentElement.contains(e.target)) {
        submenuToggle.parentElement.classList.remove('open');
      }
    });
  }

  // =========================================================
  // 2.7 햄버거 메뉴 토글 및 이미지 변경 기능 (모바일 반응형)
  // =========================================================
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const gnb = document.querySelector('.gnb');

  // 1. 버튼 안의 이미지 태그 찾기
  const hamburgerImg = hamburgerBtn ? hamburgerBtn.querySelector('img') : null;

  if (hamburgerBtn && gnb && hamburgerImg) {
    // 햄버거 버튼 클릭 이벤트
    hamburgerBtn.addEventListener('click', () => {
      gnb.classList.toggle('active');

      // 2. 메뉴가 열렸는지(active) 확인 후 이미지 경로(src) 변경
      if (gnb.classList.contains('active')) {
        hamburgerImg.src = 'img/potato_x.png'; // 닫기(X) 이미지 경로
        hamburgerImg.alt = '메뉴 닫기';
      } else {
        hamburgerImg.src = 'img/burger_menu.png'; // 원래 햄버거 이미지 경로
        hamburgerImg.alt = '메뉴 열기';
      }
    });

    // 메뉴 이동 시 모바일 전체화면 메뉴 자동으로 닫기
    const gnbLinks = gnb.querySelectorAll('a');
    gnbLinks.forEach((link) => {
      link.addEventListener('click', () => {
        // 하위 메뉴를 여는 버튼('video')은 클릭해도 메뉴가 닫히면 안 됨
        if (!link.classList.contains('submenu-toggle')) {
          gnb.classList.remove('active');

          // 3. 링크를 눌러서 메뉴가 닫힐 때도 원래 햄버거 이미지로 복구
          hamburgerImg.src = 'img/burger_menu.png';
          hamburgerImg.alt = '메뉴 열기';
        }
      });
    });
  }

  // =========================================================
  // 3. Top 버튼 관련 기능
  // =========================================================
  const btnTop = document.querySelector('.btn-top');
  if (btnTop) {
    btnTop.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScroll(0, 500);
    });
    window.addEventListener('scroll', () => {
      btnTop.classList.toggle('show', window.pageYOffset >= 500);
    });
  }

  // =========================================================
  // 4. 쇼츠 드래그 및 버튼 스크롤 기능
  // =========================================================
  const shortsSlider = document.querySelector('.short-list');
  const prevBtn = document.querySelector('.short .prev-btn');
  const nextBtn = document.querySelector('.short .next-btn');

  if (shortsSlider) {
    let isDown = false;
    let isDragged = false; // 드래그 여부 추적
    let startX;
    let scrollLeft;

    shortsSlider.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDown = true;
      isDragged = false; // 초기화
      shortsSlider.classList.add('active');
      shortsSlider.style.cursor = 'grabbing';
      startX = e.pageX - shortsSlider.offsetLeft;
      scrollLeft = shortsSlider.scrollLeft;
    });

    shortsSlider.addEventListener('mouseleave', () => {
      isDown = false;
      shortsSlider.classList.remove('active');
      shortsSlider.style.cursor = 'grab';
    });

    shortsSlider.addEventListener('mouseup', () => {
      isDown = false;
      shortsSlider.classList.remove('active');
      shortsSlider.style.cursor = 'grab';
    });

    shortsSlider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      // 5px 이상 움직이면 드래그로 간주
      if (Math.abs(e.pageX - (startX + shortsSlider.offsetLeft)) > 5) {
        isDragged = true;
      }
      e.preventDefault();
      const x = e.pageX - shortsSlider.offsetLeft;
      const walk = x - startX;
      shortsSlider.scrollLeft = scrollLeft - walk;
    });

    // 드래그 후 클릭 이벤트 방지
    shortsSlider.addEventListener('click', (e) => {
      if (isDragged) {
        e.preventDefault();
      }
    });

    // 버튼 클릭 로직
    if (prevBtn && nextBtn) {
      const duration = 600;
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = shortsSlider.scrollLeft - shortsSlider.offsetWidth;
        smoothScrollBy(shortsSlider, target, duration);
      });
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = shortsSlider.scrollLeft + shortsSlider.offsetWidth;
        smoothScrollBy(shortsSlider, target, duration);
      });
    }
  }

  // =========================================================
  // 5. 비디오 섹션 (카드 슬라이더) 기능
  // =========================================================
  {
    const videoSection = document.querySelector('#video');
    if (videoSection) {
      const cards = videoSection.querySelectorAll('.card');
      const indicatorContainer = videoSection.querySelector('.indicator-container');
      const sliderTrack = videoSection.querySelector('.slider-track');

      let currentIndex = 0;
      let autoSlideInterval;

      // 인디케이터 동적 생성
      if (indicatorContainer) {
        indicatorContainer.innerHTML = '';
        cards.forEach((_, index) => {
          const dot = document.createElement('div');
          dot.classList.add('dot');
          dot.setAttribute('data-index', index);
          if (index === 0) dot.classList.add('active');
          indicatorContainer.appendChild(dot);
        });
      }

      const dots = videoSection.querySelectorAll('.dot');

      // 슬라이더 화면 업데이트 로직
      function updateSlider() {
        cards.forEach((card, index) => {
          card.classList.remove('active', 'prev-card', 'next-card');
          if (index === currentIndex) {
            card.classList.add('active');
          } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
            card.classList.add('prev-card');
          } else if (index === (currentIndex + 1) % cards.length) {
            card.classList.add('next-card');
          } else {
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
          }

          if (
            card.classList.contains('active') ||
            card.classList.contains('prev-card') ||
            card.classList.contains('next-card')
          ) {
            card.style.opacity = '';
            card.style.pointerEvents = '';
          }
        });

        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }

      // 자동 슬라이드 시작 및 정지 로직
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

      // 마우스 이벤트 연결 (일시정지 및 재개)
      cards.forEach((card) => {
        card.addEventListener('mouseenter', stopAutoSlide);
        card.addEventListener('mouseleave', startAutoSlide);
      });

      dots.forEach((dot) => {
        dot.addEventListener('mouseenter', stopAutoSlide);
        dot.addEventListener('mouseleave', startAutoSlide);
        dot.addEventListener('click', () => {
          currentIndex = parseInt(dot.getAttribute('data-index'));
          updateSlider();
        });
      });

      // 드래그 및 터치 넘기기 로직
      let isVideoDragging = false;
      let videoStartX = 0;
      let currentTranslate = 0;
      const dragThreshold = 60;

      function onVideoDragStart(e) {
        stopAutoSlide();
        isVideoDragging = true;
        videoStartX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
      }

      function onVideoDragMove(e) {
        if (!isVideoDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        currentTranslate = currentX - videoStartX;
      }

      function onVideoDragEnd() {
        if (!isVideoDragging) return;
        isVideoDragging = false;

        if (currentTranslate < -dragThreshold) {
          currentIndex = (currentIndex + 1) % cards.length;
        } else if (currentTranslate > dragThreshold) {
          currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        }

        updateSlider();
        currentTranslate = 0;
        startAutoSlide();
      }

      if (sliderTrack) {
        sliderTrack.addEventListener('mousedown', onVideoDragStart);
        window.addEventListener('mousemove', onVideoDragMove);
        window.addEventListener('mouseup', onVideoDragEnd);
        sliderTrack.addEventListener('touchstart', onVideoDragStart, { passive: true });
        window.addEventListener('touchmove', onVideoDragMove, { passive: true });
        window.addEventListener('touchend', onVideoDragEnd);
      }

      // 초기화
      updateSlider();
      startAutoSlide();
    }
  }
});
