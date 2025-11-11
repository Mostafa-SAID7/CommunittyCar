import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fadeInUpTrigger, fadeInLeftTrigger, fadeInRight, staggerAnimation, counterAnimation } from '../../core/utilities/animations';
import { Car, Shield, Headphones, MapPin, Zap, CheckCircle, Users, Award, Star, ChevronDown, ChevronLeft, ChevronRight, Send, Mail, Phone, ArrowRight } from 'lucide-angular';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { IconComponent } from '../../shared/components/icons/icon.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

interface Statistic {
  id: number;
  value: number;
  label: string;
  suffix: string;
  icon: string;
  color: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, IconComponent],
  templateUrl: './home.component.html',
  animations: [
    fadeInUpTrigger,
    fadeInLeftTrigger,
    fadeInRight,
    staggerAnimation,
    counterAnimation
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  isScrolled = false;
  private scrollTimeout: any;
  private counterInterval: any;

  features: Feature[] = [
    {
      icon: 'Car',
      title: 'Wide Selection',
      description: 'Choose from hundreds of premium vehicles in our extensive fleet.',
      color: 'text-blue-500'
    },
    {
      icon: 'Shield',
      title: 'Fully Insured',
      description: 'Complete insurance coverage for peace of mind during your rental.',
      color: 'text-green-500'
    },
    {
      icon: 'Headphones',
      title: '24/7 Support',
      description: 'Round-the-clock customer support whenever you need assistance.',
      color: 'text-purple-500'
    },
    {
      icon: 'MapPin',
      title: 'Multiple Locations',
      description: 'Convenient pickup and drop-off locations across the city.',
      color: 'text-red-500'
    },
    {
      icon: 'Zap',
      title: 'Instant Booking',
      description: 'Book your car in minutes with our streamlined online process.',
      color: 'text-yellow-500'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Owners',
      description: 'All our cars and owners are thoroughly vetted and verified.',
      color: 'text-indigo-500'
    }
  ];

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Community Car made my business trip so much easier. The car was spotless and the booking process was incredibly smooth. Highly recommend!',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Weekend Adventurer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Amazing experience! The SUV I rented was perfect for our family road trip. Great value for money and excellent customer service.',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'As a student, finding affordable transportation is crucial. Community Car offers competitive rates and reliable vehicles. Love it!',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Family Man',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Perfect for family vacations! The minivan was spacious and well-maintained. The whole process was hassle-free from start to finish.',
      date: '1 week ago'
    }
  ];

  statistics: Statistic[] = [
    {
      id: 1,
      value: 0,
      label: 'Happy Customers',
      suffix: '+',
      icon: 'Users',
      color: 'text-blue-500'
    },
    {
      id: 2,
      value: 0,
      label: 'Cars Available',
      suffix: '+',
      icon: 'Car',
      color: 'text-green-500'
    },
    {
      id: 3,
      value: 0,
      label: 'Cities Covered',
      suffix: '+',
      icon: 'MapPin',
      color: 'text-purple-500'
    },
    {
      id: 4,
      value: 0,
      label: 'Years Experience',
      suffix: '+',
      icon: 'Award',
      color: 'text-yellow-500'
    }
  ];

  private readonly targetStats = [50000, 2500, 50, 8];

  faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I book a car?',
      answer: 'Booking is simple! Choose your dates, select a car, and complete the booking process online. You\'ll receive instant confirmation.',
      isOpen: false
    },
    {
      id: 2,
      question: 'What documents do I need?',
      answer: 'You\'ll need a valid driver\'s license, proof of identity, and a credit card for the security deposit. International renters may need additional documentation.',
      isOpen: false
    },
    {
      id: 3,
      question: 'Is insurance included?',
      answer: 'Yes, all our rentals include comprehensive insurance coverage. You can also add additional coverage options for extra peace of mind.',
      isOpen: false
    },
    {
      id: 4,
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 24 hours before pickup for a full refund. Cancellations within 24 hours may incur a small fee.',
      isOpen: false
    },
    {
      id: 5,
      question: 'What if I return the car late?',
      answer: 'Late returns may incur additional charges. Please contact us immediately if you anticipate being late so we can assist you.',
      isOpen: false
    },
    {
      id: 6,
      question: 'Are there mileage limits?',
      answer: 'Most rentals include unlimited mileage. Some specialty vehicles may have mileage caps - this will be clearly indicated during booking.',
      isOpen: false
    }
  ];

  ngOnInit(): void {
    this.startCounterAnimation();
    this.autoAdvanceSlideshow();
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 50;
  }

  private startCounterAnimation(): void {
    let currentValues = [0, 0, 0, 0];
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = duration / steps;

    this.counterInterval = setInterval(() => {
      currentValues = currentValues.map((current, index) => {
        const target = this.targetStats[index];
        const step = target / steps;
        if (current < target) {
          return Math.min(current + step, target);
        }
        return target;
      });

      this.statistics.forEach((stat, index) => {
        stat.value = Math.floor(currentValues[index]);
      });

      // Check if all counters reached their targets
      if (currentValues.every((value, index) => value >= this.targetStats[index])) {
        clearInterval(this.counterInterval);
        // Set final values
        this.statistics.forEach((stat, index) => {
          stat.value = this.targetStats[index];
        });
      }
    }, increment);
  }

  private autoAdvanceSlideshow(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
    }, 5000); // Change slide every 5 seconds
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.testimonials.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  toggleFAQ(faq: FAQ): void {
    this.faqs.forEach(f => {
      if (f.id !== faq.id) {
        f.isOpen = false;
      }
    });
    faq.isOpen = !faq.isOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  trackByFeature(index: number, feature: Feature): string {
    return feature.title;
  }

  trackByStat(index: number, stat: Statistic): number {
    return stat.id;
  }

  trackByTestimonial(index: number, testimonial: Testimonial): number {
    return testimonial.id;
  }

  trackByFaq(index: number, faq: FAQ): number {
    return faq.id;
  }
}
