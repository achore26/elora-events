/**
 * ELORA EVENTS - Modern Luxury Portfolio Website
 * Inspired by Entourage Intl
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Lenis Smooth Scrolling (Entourage Luxury Agency Standard)
  // ------------------------------------------------------------------------
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Helper for smooth scrolling to element
  function scrollToTarget(target) {
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ------------------------------------------------------------------------
  // 2. Smart Sticky Header (Hide on Scroll Down, Reveal on Scroll Up)
  // ------------------------------------------------------------------------
  const header = document.querySelector('.main-header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    // Hide when scrolling down removed per user request

    lastScrollY = Math.max(0, currentScrollY);
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 3. Fullscreen Drawer Navigation (Entourage Style)
  // ------------------------------------------------------------------------
  const menuToggleBtn = document.querySelector('.menu-toggle-btn');
  const fullscreenDrawer = document.querySelector('.fullscreen-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link-item');

  function toggleDrawer() {
    const isOpen = fullscreenDrawer.classList.contains('is-open');
    if (isOpen) {
      fullscreenDrawer.classList.remove('is-open');
      menuToggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    } else {
      fullscreenDrawer.classList.add('is-open');
      menuToggleBtn.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }
  }

  if (menuToggleBtn && fullscreenDrawer) {
    menuToggleBtn.addEventListener('click', toggleDrawer);

    // Close when clicking any nav link inside drawer
    drawerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          toggleDrawer();
          const target = document.querySelector(href);
          if (target) {
            setTimeout(() => scrollToTarget(target), 300);
          }
        }
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullscreenDrawer.classList.contains('is-open')) {
        toggleDrawer();
      }
    });
  }

  // Handle initial hash or ?scroll= query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const scrollParam = urlParams.get('scroll');
  const targetSelector = scrollParam ? `#${scrollParam}` : window.location.hash;
  if (targetSelector) {
    const initTarget = document.querySelector(targetSelector);
    if (initTarget) {
      window.scrollTo({ top: initTarget.offsetTop - 80, behavior: 'instant' });
      setTimeout(() => {
        scrollToTarget(initTarget);
      }, 100);
    }
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        scrollToTarget(targetEl);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. Animated Impact Counters (Intersection Observer)
  // ------------------------------------------------------------------------
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  const countUp = (el, target, duration = 2000) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out expo
      const currentVal = Math.floor((1 - Math.pow(2, -10 * progress)) * target);
      el.textContent = currentVal.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  };

  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        metricNumbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-target'), 10);
          if (!isNaN(target)) {
            countUp(numEl, target, 2200);
          }
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    metricsObserver.observe(metricsSection);
  }

  // ------------------------------------------------------------------------
  // 5. Authentic Portfolio Data & Case Study Modal
  // ------------------------------------------------------------------------
  const projectDatabase = {
    'ms-understood-festival': {
      title: 'Ms Understood Festival',
      category: 'High-Capacity Festival',
      venue: 'Two Rivers Mall, Nairobi',
      capacity: '2,000+ Attendees',
      role: 'Full Festival Planning & Management',
      image: 'assets/images/project_two_rivers.png',
      description: 'A landmark high-capacity cultural festival bringing together 2,000+ enthusiastic attendees for an electric celebration of female voices, music, empowerment, and culture at Two Rivers Mall. Elora oversaw 360-degree event production from stage architecture to crowd logistics.',
      deliverables: [
        'Mainstage & Audio/Visual Staging Design',
        '2,000+ Pax Crowd Ingress & Egress Management',
        'Multi-Vendor Food & Beverage Pavilion',
        'VIP Hospitality & Artist Green Room Curation',
        'Two Rivers Security & Safety Protocol Compliance',
        'Post-Event Site Reinstatement & Evaluation'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'women-summit': {
      title: 'What Women Want Summit 2024',
      category: 'Corporate Summit & Activations',
      venue: 'Trademark Hotel, Nairobi',
      capacity: '2,000 Pax',
      role: 'Project Management & Session Direction (Youth+ Africa)',
      image: 'assets/images/project_women_summit.png',
      video: 'assets/videos/women_summit_reel.mp4',
      poster: 'assets/videos/women_summit_poster.jpg',
      description: 'Project management and high-level execution for the prestigious What Women Want Summit 2024 sessions hosted by Youth+ Africa at Trademark Hotel. Ensured flawless multi-speaker sessions, plenary transitions, and executive VIP attendee experiences.',
      deliverables: [
        'Multi-Track Speaker Coordination & Stage Flow',
        'Trademark Hotel Executive Hall Production',
        'Youth+ Africa Sponsor Activation Coordination',
        'Delegate Registration & Welcome Concierge',
        'Live Broadcast & Media Partner Liaison',
        'Precision Timekeeping & Program Direction'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'podquest-2024': {
      title: 'PodQuest 2024 by Youth+ Radio',
      category: 'Corporate & Media Production',
      venue: 'The Alchemist, Westlands',
      capacity: '300 Pax',
      role: 'Event Management & Project Planning',
      image: 'assets/images/project_podquest.png',
      video: 'assets/videos/podquest_reel.mp4',
      poster: 'assets/videos/podquest_poster.jpg',
      description: 'Youth+ Radio’s flagship annual PodQuest event celebrating emerging podcast creators, live recording showcases, and interactive audio workshops in Nairobi’s cultural hub, The Alchemist.',
      deliverables: [
        'Acoustic Staging & Live Recording Technical Oversight',
        'Trophy & Award Presentation Coordination',
        'Venue Transformation & Brand Wall Staging',
        'Podcast Creator & Panelist Hospitality',
        'Ticket & Guest Flow Control',
        'Sponsor Showcase Integration'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'ms-understood-garden': {
      title: 'Ms Understood (Garden Edition)',
      category: 'Experiential & Outdoor Stage',
      venue: 'Private Gardens, Nairobi Arboretum',
      capacity: '250 Pax',
      role: 'Event Management & Environmental Styling',
      image: 'assets/images/project_arboretum.png',
      description: 'An intimate, nature-immersed gathering featuring heartfelt conversations with the signature "Dear Younger Me" stage backdrop in the serene greenery of the Arboretum private gardens.',
      deliverables: [
        'Natural Canopy Stage & Modern Lounge Furnishing',
        'Signature "Dear Younger Me" Visual Wall',
        'Atmospheric Garden Lighting & Acoustic Balancing',
        'Vendor Coordination (Artisan Catering & Drinks)',
        'Eco-Conscious Zero-Footprint Arboretum Permitting',
        'Seamless On-Site Guest Concierge'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'cysuites-birthday': {
      title: '30th Milestone Birthday Lunch',
      category: 'Intimate Event & Luxury Styling',
      venue: 'CySuites Apartment Hotel, Nairobi',
      capacity: '30 Pax',
      role: 'Event Planning, Bespoke Tablescape & Styling',
      image: 'assets/images/project_cysuites.png',
      description: 'An exquisitely styled milestone 30th birthday celebration featuring refined rose-gold charger plates, custom stationery, bespoke gold cutlery, and floral centerpieces designed for an unforgettable private celebration.',
      deliverables: [
        'Bespoke Rose & Gold Tablescape Concept',
        'Custom Menus & Personalized Place Settings',
        'Curated Floral Artistry & Candle Decor',
        'Private Chef Course Coordination',
        'Photo-Ready Focal Point & Balloon Artistry',
        'Seamless Day-of Styling & Coordination'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'cotton-tree-dinner': {
      title: 'Romantic Birthday Dinner',
      category: 'Intimate Event & Floral Styling',
      venue: 'Cotton Tree Eatery, Nairobi',
      capacity: '20 Pax',
      role: 'Event Planning & Floral Styling',
      image: 'assets/images/project_cotton_tree.png',
      description: 'A sophisticated and intimate birthday dinner styled with opulent crimson and blush roses, gold chargers, tailored table linens, and soft ambient mood lighting at Cotton Tree Eatery.',
      deliverables: [
        'Lush Fresh Rose Runner Arrangements',
        'Luxury Metallic Cutlery & Linen Pairing',
        'Venue Styling & Lighting Ambiance',
        'Pre-Planned Course Schedule & Toast Timing',
        'Customized Birthday Cake Presentation',
        'Full Setup & Midnight Breakdown'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'praise-and-paint': {
      title: 'Praise & Paint (Edition 1)',
      category: 'Experiential Workshop & Community',
      venue: 'Parklands Baptist, Nairobi',
      capacity: '20 Pax',
      role: 'Event Planning & Coordination',
      image: 'assets/images/project_praise_paint.png',
      description: 'An uplifting interactive faith and art workshop blending soulful praise, expressive canvas painting, and heartfelt fellowship in an inspiring, beautifully arranged environment.',
      deliverables: [
        'Art Station Logistics & Easel Procurement',
        'Thematic Graphic Artwork & Flyer Branding',
        'Audio Acoustic Balancing for Praise Session',
        'Light Refreshments & Hospitality Management',
        'Facilitator & Artist Alignment',
        'Participant Keepsake Packaging'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'home-dinner': {
      title: 'Artisan Private Residence Dinner',
      category: 'Intimate Event & Bespoke Styling',
      venue: 'Private Residence, Nairobi',
      capacity: '12 Pax',
      role: 'Event Styling & Tablescape Design',
      image: 'assets/images/project_home_dinner.png',
      description: 'A warm, intimate residential dinner elevated into a five-star dining atmosphere through delicate baby’s breath florals, elegant crystal glassware, and tailored fabric drapery.',
      deliverables: [
        'Residential Space Transformation',
        'Organic Baby’s Breath Floral Cloud Sculptures',
        'Crystal Glassware & Vintage Plate Settings',
        'Ambient Candlelight & Tabletop Layering',
        'Private Butler & Kitchen Service Support',
        'Flawless Restoration of Client Residence'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'africa-soft-power-gala': {
      title: 'Africa Soft Power Gala Dinner',
      category: 'Grand Gala & Staging',
      venue: 'Grand Ballroom, Nairobi',
      capacity: '500+ Guests',
      role: 'Turnkey Gala Production & Hospitality',
      image: 'assets/images/gallery/event_photo_02.jpg',
      gallery: [
        'assets/images/gallery/event_photo_02.jpg',
        'assets/images/gallery/event_photo_04.jpg',
        'assets/images/gallery/event_photo_06.jpg',
        'assets/images/gallery/event_photo_03.jpg',
        'assets/images/gallery/event_photo_05.jpg'
      ],
      description: 'A prestigious high-level ballroom gala evening featuring lavish floral centerpieces, illuminated staging with branded Africa Soft Power backdrops, multi-course culinary service coordination, and VIP protocol management.',
      deliverables: [
        'Custom Chandelier & Ballroom Ambient Lighting',
        '500+ Guest Multi-Course Dining Hospitality',
        'Keynote Stage & LED Audio-Visual Engineering',
        'VIP Protocol & Security Logistics Flow',
        'Curated Artisan Floral Tablescapes',
        'Turnkey Production from Load-in to Midnight Strike'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'summit-executive-stage': {
      title: 'Executive Plenary & Summit Stage',
      category: 'Audiovisual & Stage Direction',
      venue: 'Convention Center, Nairobi',
      capacity: '800+ Guests',
      role: 'Technical Staging & Session Direction',
      image: 'assets/images/gallery/event_photo_07.jpg',
      gallery: [
        'assets/images/gallery/event_photo_07.jpg',
        'assets/images/gallery/event_photo_08.jpg',
        'assets/images/gallery/event_photo_09.jpg'
      ],
      description: 'A major corporate summit staging featuring high-definition projection, multi-speaker stage sets, branded sponsor backdrops, and flawless run-of-show timing.',
      deliverables: [
        'Plenary Hall Stage Architecture',
        'Multi-Screen Projection & Audio Balancing',
        'Speaker Presentation & Greenroom Flow',
        'Delegate Registration & Hall Transitions',
        'Live Broadcast Liaison & Recording Management',
        'Rapid Session Turnarounds'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'chandelier-ballroom-reception': {
      title: 'Chandelier Ballroom Reception',
      category: 'Atmospheric Ambiance & Dining',
      venue: 'Luxury Hotel Ballroom, Nairobi',
      capacity: '350 Guests',
      role: 'Event Styling & Banquet Direction',
      image: 'assets/images/gallery/event_photo_06.jpg',
      gallery: [
        'assets/images/gallery/event_photo_06.jpg',
        'assets/images/gallery/event_photo_02.jpg',
        'assets/images/gallery/event_photo_04.jpg',
        'assets/images/gallery/event_photo_05.jpg'
      ],
      description: 'An enchanting evening banquet designed with warm golden ambient illumination, sparkling crystal chandeliers, tailored linen, and five-star culinary service management.',
      deliverables: [
        'Warm Golden & Terracotta Mood Lighting Design',
        'Opulent Crystal Glassware & Table Settings',
        'Banquet Floor Run-of-Show & Toast Cues',
        'Sommelier & Catering Staff Synchronization',
        'Acoustic Band Staging & Audio Engineering',
        'End-to-End Teardown & Venue Handover'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    },
    'curated-vip-lounge': {
      title: 'Bespoke VIP Lounge & Reception',
      category: 'Intimate VIP Styling',
      venue: 'Private Rooftop Lounge, Nairobi',
      capacity: '120 Guests',
      role: 'Space Concept, Furnishing & Lounge Management',
      image: 'assets/images/gallery/event_photo_10.jpg',
      gallery: [
        'assets/images/gallery/event_photo_10.jpg',
        'assets/images/gallery/event_photo_11.jpg',
        'assets/images/gallery/event_photo_12.jpg'
      ],
      description: 'An exclusive rooftop VIP lounge styled with contemporary modular furnishings, mood lighting, tailored cocktail bars, and dedicated concierge hospitality.',
      deliverables: [
        'Custom Contemporary Furniture Layout',
        'Accent Ambient Lighting & Candle Sculptures',
        'Mixology Bar Logistics & Glassware Pairing',
        'Guest Ingress & Private Concierge Check-in',
        'Background DJ & Ambient Sound Staging',
        'Flawless Midnight Strike & Cleanup'
      ],
      instagramUrl: 'https://www.instagram.com/_eloraevents/'
    }
  };

  // ------------------------------------------------------------------------
  // 5b. Interactive Video Reels Controller (Elora In Motion)
  // ------------------------------------------------------------------------
  const reelCards = document.querySelectorAll('.reel-card');

  reelCards.forEach(card => {
    const video = card.querySelector('.reel-video-player');
    const playBtn = card.querySelector('.reel-play-btn');
    const soundBtn = card.querySelector('.reel-sound-btn');
    const progressTrack = card.querySelector('.reel-progress-track');
    const progressBar = card.querySelector('.reel-progress-bar');
    const container = card.querySelector('.reel-video-container');
    const iconPlay = playBtn?.querySelector('.icon-play');
    const iconPause = playBtn?.querySelector('.icon-pause');
    const iconMuted = soundBtn?.querySelector('.icon-sound-muted');
    const iconSoundOn = soundBtn?.querySelector('.icon-sound-on');
    const soundLabel = soundBtn?.querySelector('.sound-label');

    if (!video) return;

    video.muted = true; // Default muted

    function togglePlay() {
      if (video.paused) {
        // Pause all other reels
        document.querySelectorAll('.reel-video-player').forEach(otherVid => {
          if (otherVid !== video && !otherVid.paused) {
            otherVid.pause();
            otherVid.closest('.reel-card')?.classList.remove('is-playing');
            const otherPlayBtn = otherVid.closest('.reel-card')?.querySelector('.reel-play-btn');
            if (otherPlayBtn) {
              const op = otherPlayBtn.querySelector('.icon-play');
              const opa = otherPlayBtn.querySelector('.icon-pause');
              if (op) op.style.display = 'block';
              if (opa) opa.style.display = 'none';
            }
          }
        });

        video.play().then(() => {
          card.classList.add('is-playing');
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'block';
        }).catch(err => console.log('Autoplay policy caught:', err));
      } else {
        video.pause();
        card.classList.remove('is-playing');
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    if (container) {
      container.addEventListener('click', (e) => {
        if (e.target.closest('.reel-bottom-controls')) return;
        togglePlay();
      });
    }

    video.addEventListener('timeupdate', () => {
      if (progressBar && video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${pct}%`;
      }
    });

    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (video.duration && rect.width > 0) {
          video.currentTime = (clickX / rect.width) * video.duration;
        }
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        if (video.muted) {
          if (iconMuted) iconMuted.style.display = 'block';
          if (iconSoundOn) iconSoundOn.style.display = 'none';
          if (soundLabel) soundLabel.textContent = 'Unmute';
        } else {
          if (iconMuted) iconMuted.style.display = 'none';
          if (iconSoundOn) iconSoundOn.style.display = 'block';
          if (soundLabel) soundLabel.textContent = 'Mute';
        }
      });
    }
  });

  // ------------------------------------------------------------------------
  // 6. Portfolio Filtering
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const categories = category.split(/\s+/);
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 7. Case Study Modal Interactions with Image & Video Reel Support
  // ------------------------------------------------------------------------
  const projectModal = document.querySelector('.project-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalHeroImg = projectModal?.querySelector('.modal-hero-img');
  const modalVideoWrap = projectModal?.querySelector('.modal-video-wrap');
  const modalVideoPlayer = projectModal?.querySelector('.modal-video-player');
  const modalSwitcher = projectModal?.querySelector('.modal-media-switcher');
  const switchBtns = projectModal?.querySelectorAll('.media-switch-btn');
  const modalThumbsContainer = document.getElementById('modal-gallery-thumbs');

  function setModalMediaView(view) {
    if (view === 'video') {
      if (modalHeroImg) modalHeroImg.parentElement.style.display = 'none';
      if (modalVideoWrap) modalVideoWrap.style.display = 'flex';
      switchBtns?.forEach(b => b.classList.toggle('active', b.getAttribute('data-view') === 'video'));
      if (modalVideoPlayer && modalVideoPlayer.src) {
        modalVideoPlayer.play().catch(() => {});
      }
    } else {
      if (modalHeroImg) modalHeroImg.parentElement.style.display = 'block';
      if (modalVideoWrap) {
        modalVideoWrap.style.display = 'none';
        if (modalVideoPlayer) modalVideoPlayer.pause();
      }
      switchBtns?.forEach(b => b.classList.toggle('active', b.getAttribute('data-view') === 'image'));
    }
  }

  switchBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      setModalMediaView(btn.getAttribute('data-view'));
    });
  });

  function openModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data || !projectModal) return;

    if (modalHeroImg) {
      modalHeroImg.src = data.image;
      modalHeroImg.alt = data.title;
    }

    projectModal.querySelector('.modal-category').textContent = data.category;
    projectModal.querySelector('.modal-title').textContent = data.title;
    projectModal.querySelector('.modal-venue').textContent = data.venue;
    projectModal.querySelector('.modal-capacity').textContent = data.capacity;
    projectModal.querySelector('.modal-role').textContent = data.role;
    projectModal.querySelector('.modal-description').textContent = data.description;

    // Multi-photo gallery thumbnails
    if (modalThumbsContainer) {
      modalThumbsContainer.innerHTML = '';
      if (data.gallery && data.gallery.length > 1) {
        modalThumbsContainer.style.display = 'flex';
        data.gallery.forEach((imgUrl, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `modal-thumb-btn ${idx === 0 ? 'is-active' : ''}`;
          btn.setAttribute('aria-label', `View photo ${idx + 1}`);
          btn.innerHTML = `<img src="${imgUrl}" alt="Thumbnail ${idx + 1}">`;
          btn.addEventListener('click', () => {
            modalThumbsContainer.querySelectorAll('.modal-thumb-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            if (modalHeroImg) {
              modalHeroImg.style.opacity = '0';
              setTimeout(() => {
                modalHeroImg.src = imgUrl;
                modalHeroImg.style.opacity = '1';
              }, 150);
            }
            setModalMediaView('image');
          });
          modalThumbsContainer.appendChild(btn);
        });
      } else {
        modalThumbsContainer.style.display = 'none';
      }
    }

    const deliverablesContainer = projectModal.querySelector('.modal-deliverables-list');
    deliverablesContainer.innerHTML = '';
    data.deliverables.forEach(item => {
      const li = document.createElement('div');
      li.className = 'modal-deliverable-item';
      li.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${item}</span>
      `;
      deliverablesContainer.appendChild(li);
    });

    const instagramBtn = projectModal.querySelector('.modal-instagram-btn');
    if (instagramBtn) {
      instagramBtn.href = data.instagramUrl;
    }

    // Configure Video or Photo View
    if (data.video && modalVideoPlayer) {
      modalVideoPlayer.src = data.video;
      modalVideoPlayer.poster = data.poster || data.image;
      if (modalSwitcher) modalSwitcher.style.display = 'flex';
      setModalMediaView('video');
    } else {
      if (modalSwitcher) modalSwitcher.style.display = 'none';
      if (modalVideoWrap) modalVideoWrap.style.display = 'none';
      if (modalHeroImg) modalHeroImg.parentElement.style.display = 'block';
      if (modalVideoPlayer) {
        modalVideoPlayer.pause();
        modalVideoPlayer.src = '';
      }
      setModalMediaView('image');
    }

    projectModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeModal() {
    if (!projectModal) return;

    // Pause modal video
    if (modalVideoPlayer) {
      modalVideoPlayer.pause();
      modalVideoPlayer.src = '';
    }

    projectModal.classList.remove('is-active');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      if (projectId) openModal(projectId);
    });
  });

  // Connect reel modal trigger buttons
  document.querySelectorAll('.reel-view-study-btn, .reel-fullscreen-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute('data-project-id');
      if (pId) openModal(pId);
    });
  });

  // Handle direct modal deep-linking via ?modal=
  const modalParam = urlParams.get('modal');
  if (modalParam) {
    setTimeout(() => {
      openModal(modalParam);
    }, 250);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. Interactive Event Scope & Budget Planner
  // ------------------------------------------------------------------------
  const plannerBtns = document.querySelectorAll('.planner-choice-btn');
  const summaryType = document.getElementById('summary-type');
  const summaryScale = document.getElementById('summary-scale');
  const summaryScope = document.getElementById('summary-scope');
  const summaryTimeline = document.getElementById('summary-timeline');
  const applyPlannerBtn = document.getElementById('apply-planner-btn');

  let plannerState = {
    type: 'Intimate Event',
    scale: '10 - 50 Guests',
    scope: 'Full 360° Management',
    timeline: '3 - 6 Weeks'
  };

  plannerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-group');
      const val = btn.getAttribute('data-val');

      // Unselect siblings
      document.querySelectorAll(`.planner-choice-btn[data-group="${group}"]`).forEach(b => {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');

      plannerState[group] = val;

      // Dynamic timeline estimation
      if (group === 'scale' || group === 'type') {
        if (plannerState.scale.includes('500') || plannerState.scale.includes('2,000') || plannerState.type.includes('Festival')) {
          plannerState.timeline = '8 - 16 Weeks';
        } else if (plannerState.scale.includes('100')) {
          plannerState.timeline = '4 - 8 Weeks';
        } else {
          plannerState.timeline = '2 - 5 Weeks';
        }
      }

      // Update UI summary
      if (summaryType) summaryType.textContent = plannerState.type;
      if (summaryScale) summaryScale.textContent = plannerState.scale;
      if (summaryScope) summaryScope.textContent = plannerState.scope;
      if (summaryTimeline) summaryTimeline.textContent = plannerState.timeline;
    });
  });

  if (applyPlannerBtn) {
    applyPlannerBtn.addEventListener('click', () => {
      const formEventType = document.getElementById('form-event-type');
      const formGuests = document.getElementById('form-guests');
      const formNotes = document.getElementById('form-notes');

      if (formEventType) formEventType.value = plannerState.type;
      if (formGuests) formGuests.value = plannerState.scale;
      if (formNotes) {
        formNotes.value = `Selected Scope: ${plannerState.scope}\nEstimated Timeline: ${plannerState.timeline}\nLooking forward to bringing a ray of light to our event!`;
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) scrollToTarget(contactSection);
    });
  }

  // ------------------------------------------------------------------------
  // 9. Contact & Consultation Form (Validation & WhatsApp Integration)
  // ------------------------------------------------------------------------
  const consultationForm = document.getElementById('consultation-form');
  const formFeedback = document.querySelector('.form-feedback');
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-btn');

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const phone = document.getElementById('form-phone')?.value.trim();
      const eventType = document.getElementById('form-event-type')?.value;
      const guests = document.getElementById('form-guests')?.value;
      const date = document.getElementById('form-date')?.value;
      const notes = document.getElementById('form-notes')?.value.trim();

      if (!name || !phone) {
        alert('Please provide your name and phone number so we can reach you.');
        return;
      }

      // Show success feedback
      if (formFeedback) {
        formFeedback.classList.add('is-success');
        formFeedback.innerHTML = `
          <strong>Thank you, ${name}!</strong><br>
          Your event consultation request has been received. The Elora Events team will get in touch via <em>${phone}</em> within 24 hours.
        `;
      }

      // Build WhatsApp message
      const textMsg = encodeURIComponent(
        `Hello Elora Events team,\n\nMy name is ${name}.\nI would like to inquire about planning an event:\n- Type: ${eventType}\n- Approximate Guests: ${guests || 'TBD'}\n- Desired Date: ${date || 'TBD'}\n- Details: ${notes || 'Let us discuss details'}\n\nPlease let me know your availability for a consultation.`
      );

      // Offer direct WhatsApp action
      if (whatsappDirectBtn) {
        whatsappDirectBtn.href = `https://wa.me/254728297636?text=${textMsg}`;
      }

      // Auto redirect option
      setTimeout(() => {
        const confirmWa = confirm('Would you also like to send this inquiry directly to Elora on WhatsApp for an instant response?');
        if (confirmWa) {
          window.open(`https://wa.me/254728297636?text=${textMsg}`, '_blank');
        }
      }, 500);

      consultationForm.reset();
    });
  }

  // ------------------------------------------------------------------------
  // 10. Scroll Spy for Active Navigation
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 11. Back to Top Button
  // ------------------------------------------------------------------------
  const backToTopBtn = document.querySelector('.footer-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ------------------------------------------------------------------------
  // 12. Ambient Emblem Mouse Parallax
  // ------------------------------------------------------------------------
  const heroWatermark = document.querySelector('.hero-watermark-center');
  if (heroWatermark) {
    window.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth) - 0.5;
      const mouseY = (e.clientY / window.innerHeight) - 0.5;
      heroWatermark.style.transform = `translate(calc(-50% + ${mouseX * 30}px), calc(-50% + ${mouseY * 30}px))`;
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 13. Luxury Atmosphere Theme Switcher (Editorial White ⇄ African Brown)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const drawerThemeToggleBtn = document.getElementById('drawer-theme-toggle');

  function applyTheme(theme) {
    const isLight = (theme === 'light' || theme === 'white');
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('theme-light');
      document.querySelectorAll('#theme-toggle .theme-btn-label, #drawer-theme-toggle .theme-btn-label').forEach(el => {
        el.textContent = 'African Brown';
      });
      localStorage.setItem('elora_theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('theme-light');
      document.querySelectorAll('#theme-toggle .theme-btn-label, #drawer-theme-toggle .theme-btn-label').forEach(el => {
        el.textContent = 'Editorial White';
      });
      localStorage.setItem('elora_theme', 'dark');
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (drawerThemeToggleBtn) {
    drawerThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Initialize Theme from URL parameter or localStorage
  const themeParam = urlParams.get('theme');
  const storedTheme = localStorage.getItem('elora_theme');

  if (themeParam === 'white' || themeParam === 'light') {
    applyTheme('light');
  } else if (themeParam === 'dark' || themeParam === 'brown') {
    applyTheme('dark');
  } else if (storedTheme === 'light') {
    applyTheme('light');
  } else {
    applyTheme('dark'); // Default African Brown
  }

  // ------------------------------------------------------------------------
  // 14. Hero Photo Showcase Switcher
  // ------------------------------------------------------------------------
  const heroPills = document.querySelectorAll('.hero-photo-pill');
  const heroShowcaseImg = document.getElementById('hero-showcase-img');
  const heroCardCat = document.getElementById('hero-card-category');
  const heroCardTitle = document.getElementById('hero-card-title');
  const heroCardVenue = document.getElementById('hero-card-venue');

  heroPills.forEach(pill => {
    pill.addEventListener('click', () => {
      heroPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const photo = pill.getAttribute('data-photo');
      const title = pill.getAttribute('data-title');
      const venue = pill.getAttribute('data-venue');
      const cat = pill.getAttribute('data-cat');

      if (heroShowcaseImg) {
        heroShowcaseImg.style.opacity = '0';
        setTimeout(() => {
          heroShowcaseImg.src = photo;
          heroShowcaseImg.style.opacity = '1';
        }, 180);
      }
      if (heroCardCat) heroCardCat.textContent = cat;
      if (heroCardTitle) heroCardTitle.textContent = title;
      if (heroCardVenue) heroCardVenue.textContent = venue;
    });
  });

  // ------------------------------------------------------------------------
  // 15. Live Visual Gallery Filtering & Lightbox Engine (12 Authentic Photos)
  // ------------------------------------------------------------------------
  const galleryData = [
    {
      src: 'assets/images/gallery/event_photo_02.jpg',
      title: 'Africa Soft Power Gala Banquet',
      category: 'Grand Galas & Banquets',
      venue: 'Grand Ballroom, Nairobi • 500+ Pax'
    },
    {
      src: 'assets/images/gallery/event_photo_03.jpg',
      title: 'Artisan Terracotta & Blush Floral Styling',
      category: 'Artisan Florals & Tablescapes',
      venue: 'Private Banquet Suite • Custom Centerpiece'
    },
    {
      src: 'assets/images/gallery/event_photo_04.jpg',
      title: 'Main Keynote Stage & Ballroom Panorama',
      category: 'Grand Galas & Banquets',
      venue: 'Grand Ballroom • Keynote Stage & Ambient Lighting'
    },
    {
      src: 'assets/images/gallery/event_photo_05.jpg',
      title: 'Bespoke Gala Candelabra Place Setting',
      category: 'Artisan Florals & Tablescapes',
      venue: 'VIP Table • Gold Candelabra & Custom Menus'
    },
    {
      src: 'assets/images/gallery/event_photo_06.jpg',
      title: 'Chandelier Ballroom Reception',
      category: 'Grand Galas & Banquets',
      venue: 'Luxury Hotel Ballroom • 350+ Pax Banquet'
    },
    {
      src: 'assets/images/gallery/event_photo_07.jpg',
      title: 'Executive Summit Plenary Hall',
      category: 'Summits & Keynote Stages',
      venue: 'Convention Center, Nairobi • 800+ Delegate Seating'
    },
    {
      src: 'assets/images/gallery/event_photo_08.jpg',
      title: 'Garden Ceremonial Stage & Floral Arch',
      category: 'Summits & Keynote Stages',
      venue: 'Estate Gardens, Nairobi • Tropical Arch Stage'
    },
    {
      src: 'assets/images/gallery/event_photo_09.jpg',
      title: 'Summit Plenary Delegate Elevation',
      category: 'Summits & Keynote Stages',
      venue: 'Convention Center • Live Symposium Rows'
    },
    {
      src: 'assets/images/gallery/event_photo_10.jpg',
      title: 'Bespoke VIP Cocktail Lounge',
      category: 'VIP Lounges & Receptions',
      venue: 'Private Rooftop, Nairobi • Dusk Ambiance'
    },
    {
      src: 'assets/images/gallery/event_photo_11.jpg',
      title: 'Garden Walkway & Festoon Canopy',
      category: 'VIP Lounges & Receptions',
      venue: 'Private Estate Grounds • Festoon Light Canopy'
    },
    {
      src: 'assets/images/gallery/event_photo_12.jpg',
      title: 'Outdoor Pavilion Bar & Banquettes',
      category: 'VIP Lounges & Receptions',
      venue: 'Private Pavilion, Nairobi • Cocktail Banquettes'
    },
    {
      src: 'assets/images/gallery/event_photo_13.jpg',
      title: 'Tropical Floral Architecture & Gold Accents',
      category: 'Artisan Florals & Tablescapes',
      venue: 'Private Dining Suite • Exotic Orchids & Gold Cutlery'
    }
  ];

  // Gallery filtering
  const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-gallery-filter');
      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const categories = cat.split(/\s+/);
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // Lightbox Viewer
  const galleryLightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = galleryLightbox?.querySelector('.lightbox-img');
  const lightboxTitle = galleryLightbox?.querySelector('.lightbox-title');
  const lightboxCategory = galleryLightbox?.querySelector('.lightbox-category');
  const lightboxMeta = galleryLightbox?.querySelector('.lightbox-meta');
  const lightboxCounter = galleryLightbox?.querySelector('.lightbox-counter');
  const lightboxCloseBtn = galleryLightbox?.querySelector('.lightbox-close-btn');
  const lightboxPrevBtn = galleryLightbox?.querySelector('.lightbox-prev-btn');
  const lightboxNextBtn = galleryLightbox?.querySelector('.lightbox-next-btn');
  const lightboxOverlay = galleryLightbox?.querySelector('.lightbox-overlay');

  let currentGalleryIdx = 0;

  function updateLightboxContent(idx) {
    if (idx < 0) idx = galleryData.length - 1;
    if (idx >= galleryData.length) idx = 0;
    currentGalleryIdx = idx;

    const item = galleryData[idx];
    if (!item || !lightboxImg) return;

    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      lightboxImg.style.opacity = '1';
    }, 150);

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCategory) lightboxCategory.textContent = item.category;
    if (lightboxMeta) lightboxMeta.textContent = item.venue;
    if (lightboxCounter) lightboxCounter.textContent = `Photo ${idx + 1} of ${galleryData.length}`;
  }

  function openLightbox(idx) {
    if (!galleryLightbox) return;
    updateLightboxContent(idx);
    galleryLightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeLightbox() {
    if (!galleryLightbox) return;
    galleryLightbox.classList.remove('is-active');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      if (!isNaN(idx)) openLightbox(idx);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => updateLightboxContent(currentGalleryIdx - 1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => updateLightboxContent(currentGalleryIdx + 1));

  window.addEventListener('keydown', (e) => {
    if (!galleryLightbox || !galleryLightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxContent(currentGalleryIdx - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(currentGalleryIdx + 1);
  });

  console.log('Elora Events Portfolio initialized successfully.');
});
