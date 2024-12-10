import { Component, HostListener, Input } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { NgClass, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-navbar-public',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
  ],
  templateUrl: './navbar-public.component.html',
  styleUrls: ['./navbar-public.component.css']
})
export class NavbarPublicComponent {
  @Input({ required: true }) side!: boolean;
  activeFragment: string | null = null;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const sections = document.querySelectorAll('section');
    let currentSection: string | null = null;

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const offset = 150; // Adjust this offset to control when the section is "active"
      if (sectionTop <= offset && sectionTop + section.offsetHeight > 0) {
        currentSection = section.getAttribute('id');
      }
    });

    this.activeFragment = currentSection;
  }

  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    // Listen for route changes and update the active fragment
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urlTree = this.router.parseUrl(this.router.url);
        this.activeFragment = urlTree.fragment || null;
      }
    });
  }

  scrollToFragment(fragment: string): void {
    if (this.router.url !== '/') {
      // Navigate to the root page
      this.router.navigate(['/'], { fragment }).then(() => {
        setTimeout(() => this.smoothScrollToFragment(fragment), 0);
      });
    } else {
      // Scroll directly if already on the root page
      this.smoothScrollToFragment(fragment);
    }
  }

  private smoothScrollToFragment(fragment: string): void {
    const targetElement = document.getElementById(fragment);
    if (targetElement) {
      const offset = 0; // Adjust for navbar height
      const targetPosition = targetElement.offsetTop - offset;
      this.smoothScroll(targetPosition, 800);
    } else {
      console.warn(`Element with ID '${fragment}' not found.`);
    }
  }

  private smoothScroll(targetPosition: number, duration: number): void {
    const startPosition = window.scrollY || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;

      // Ease function (easeInOutQuad)
      const progress = Math.min(elapsedTime / duration, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const scrollPosition = startPosition + distance * ease;
      window.scrollTo(0, scrollPosition);

      if (elapsedTime < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
}
