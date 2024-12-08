import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../services/googleMaps/google-maps-loader.service';

import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    GoogleMap,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements AfterViewInit, OnInit, OnDestroy{
  constructor(private googleMapsLoader: GoogleMapsLoaderService, private viewportScroller: ViewportScroller, private renderer: Renderer2) {}

  ngOnInit() {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      this.renderer.removeClass(mainElement, 'container');
      this.renderer.removeClass(mainElement, 'px-2');
      this.renderer.removeClass(mainElement, 'sm:px-0');
      this.renderer.removeClass(mainElement, 'mx-auto');
      this.renderer.removeClass(mainElement, 'pt-10');

    }
  }

  ngOnDestroy() {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      this.renderer.addClass(mainElement, 'container');
      this.renderer.addClass(mainElement, 'px-2');
      this.renderer.addClass(mainElement, 'sm:px-0');
      this.renderer.addClass(mainElement, 'mx-auto');
      this.renderer.addClass(mainElement, 'pt-10');
    }
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      // Dynamically load Google Maps API
      await this.googleMapsLoader.load();

      // Initialize the map after the script is loaded
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 41.22071760529942, lng: -8.686719625675341 }, // Replace with your desired coordinates
        zoom: 15, // Initial zoom level
      });

      // Add a marker to the map
      new google.maps.Marker({
        position: { lat: 41.22071760529942, lng: -8.686719625675341 }, // Replace with your desired coordinates
        map,
        title: 'Aconchego - Lar de Idosos', // Optional: title for the marker
      });
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  }

  scrollToFragment(fragment: string): void {
    const targetElement = document.getElementById(fragment);
    if (targetElement) {
      const targetPosition = targetElement.offsetTop; // Directly use the element's top position

      // Animate the scroll
      this.smoothScroll(targetPosition, 800); // 800ms for the scroll
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

