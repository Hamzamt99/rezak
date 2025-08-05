import { LayoutState } from '@/types/builder';

export const initialLayoutData: LayoutState = {
  header: [
    {
      id: 1693653637001,
      name: 'Simple Header',
      type: 'header',
      properties: {
        title: 'My Website',
        subtitle: 'Welcome to my site',
        menuItems: [
          { label: 'Home', url: '/' },
          { label: 'About', url: '/about' },
          { label: 'Contact', url: '/contact' }
        ]
      }
    }
  ],
  form: [
    {
      id: 1693653637004,
      name: 'Contact Form',
      type: 'form',
      properties: {
        title: 'Get in Touch',
        description: 'Send us a message',
        fields: [
          { type: 'text', label: 'Name', placeholder: 'Enter your name' },
          { type: 'email', label: 'Email', placeholder: 'Enter your email' },
          { type: 'textarea', label: 'Message', placeholder: 'Your message' },
          { type: 'submit', label: 'Send Message' }
        ]
      }
    },
  ],
  footer: [
    {
      id: 1693653637007,
      name: 'Simple Footer',
      type: 'footer',
      properties: {
        companyName: 'My Company',
        copyrightText: '© 2025 All rights reserved',
        socialLinks: [
          { platform: 'Twitter', url: 'https://twitter.com' },
          { platform: 'LinkedIn', url: 'https://linkedin.com' }
        ]
      }
    },
  ]
};
