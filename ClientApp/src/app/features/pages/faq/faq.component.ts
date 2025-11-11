import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqQuestion {
  question: string;
  answer: string;
  expanded: boolean;
}

interface FaqCategory {
  name: string;
  questions: FaqQuestion[];
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  imports: [CommonModule]
})
export class FaqComponent {
  faqCategories: FaqCategory[] = [
    {
      name: 'Account',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Register" button and fill in your details including name, email, and password. You will receive a verification email to activate your account.',
          expanded: false
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.',
          expanded: false
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, you can change your email address in your profile settings. You will need to verify the new email address.',
          expanded: false
        }
      ]
    },
    {
      name: 'Bookings',
      questions: [
        {
          question: 'How do I book a car?',
          answer: 'Browse available cars, select your dates, and click "Book Now". Follow the prompts to complete your booking.',
          expanded: false
        },
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel your booking up to 24 hours before the start time through your booking dashboard.',
          expanded: false
        },
        {
          question: 'What if the car is not available?',
          answer: 'If a car becomes unavailable, you will be notified immediately and offered alternative options or a full refund.',
          expanded: false
        }
      ]
    },
    {
      name: 'Payments',
      questions: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept credit cards, debit cards, and digital wallets like PayPal and Apple Pay.',
          expanded: false
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, all payments are processed through secure, encrypted channels and we do not store your payment details.',
          expanded: false
        },
        {
          question: 'When am I charged?',
          answer: 'You are charged at the time of booking confirmation. Additional fees may apply for damages or late returns.',
          expanded: false
        }
      ]
    },
    {
      name: 'Safety',
      questions: [
        {
          question: 'Are the cars insured?',
          answer: 'Yes, all cars are fully insured. You are covered for accidents, theft, and damages during your rental period.',
          expanded: false
        },
        {
          question: 'What if I have an accident?',
          answer: 'Contact emergency services first, then notify us immediately. We will guide you through the claims process.',
          expanded: false
        },
        {
          question: 'Are drivers background checked?',
          answer: 'Yes, all car owners and renters undergo thorough background checks for your safety.',
          expanded: false
        }
      ]
    },
    {
      name: 'Support',
      questions: [
        {
          question: 'How can I contact support?',
          answer: 'You can reach our support team via email, phone, or through the in-app chat feature available 24/7.',
          expanded: false
        },
        {
          question: 'What are your support hours?',
          answer: 'Our support team is available 24 hours a day, 7 days a week to assist you with any questions or issues.',
          expanded: false
        },
        {
          question: 'How long does it take to get a response?',
          answer: 'We aim to respond to all inquiries within 2 hours during business hours and within 4 hours outside business hours.',
          expanded: false
        }
      ]
    }
  ];

  toggleQuestion(categoryIndex: number, questionIndex: number): void {
    this.faqCategories[categoryIndex].questions[questionIndex].expanded =
      !this.faqCategories[categoryIndex].questions[questionIndex].expanded;
  }
}