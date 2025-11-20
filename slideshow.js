// Slideshow functionality for season pages
class SeasonSlideshow {
    constructor(containerId, season, images) {
        this.container = document.getElementById(containerId);
        this.season = season;
        this.images = images;
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        if (!this.container || this.images.length === 0) return;

        this.render();
        this.startAutoPlay();
        this.addEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="slideshow-wrapper">
                <div class="slideshow-images">
                    ${this.images.map((img, index) => `
                        <img src="${img}" 
                             alt="Пример ${this.season} ${index + 1}" 
                             class="slideshow-image ${index === 0 ? 'active' : ''}"
                             loading="lazy">
                    `).join('')}
                </div>
                <button class="slideshow-btn slideshow-prev" aria-label="Предыдущее фото">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="slideshow-btn slideshow-next" aria-label="Следующее фото">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="slideshow-dots">
                    ${this.images.map((_, index) => `
                        <button class="slideshow-dot ${index === 0 ? 'active' : ''}" 
                                data-index="${index}"
                                aria-label="Перейти к фото ${index + 1}"></button>
                    `).join('')}
                </div>
                <div class="slideshow-counter">
                    <span class="current">${this.currentIndex + 1}</span> / <span class="total">${this.images.length}</span>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        const prevBtn = this.container.querySelector('.slideshow-prev');
        const nextBtn = this.container.querySelector('.slideshow-next');
        const dots = this.container.querySelectorAll('.slideshow-dot');

        prevBtn?.addEventListener('click', () => this.prev());
        nextBtn?.addEventListener('click', () => this.next());

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            });
        });

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        const images = this.container.querySelectorAll('.slideshow-image');
        const dots = this.container.querySelectorAll('.slideshow-dot');
        const counter = this.container.querySelector('.slideshow-counter .current');

        images[this.currentIndex]?.classList.remove('active');
        dots[this.currentIndex]?.classList.remove('active');

        this.currentIndex = index;

        images[this.currentIndex]?.classList.add('active');
        dots[this.currentIndex]?.classList.add('active');
        if (counter) counter.textContent = this.currentIndex + 1;
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goToSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.next(), 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const slideshowContainer = document.getElementById('season-slideshow');
    if (slideshowContainer) {
        const season = slideshowContainer.dataset.season;
        const imagesData = slideshowContainer.dataset.images;

        if (imagesData) {
            try {
                const images = JSON.parse(imagesData);
                new SeasonSlideshow('season-slideshow', season, images);
            } catch (e) {
                console.error('Failed to parse slideshow images:', e);
            }
        }
    }
});
