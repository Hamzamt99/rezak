export interface SectionBase {
  id: number;
  name: string;
  type: 'header' | 'form' | 'footer';
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  logoUrl?: string;
  menuItems?: { label: string; url: string }[];
}

export interface FormProps {
  title: string;
  description?: string;
  fields: {
    type: 'text' | 'email' | 'password' | 'textarea' | 'submit';
    label: string;
    placeholder?: string;
  }[];
}

export interface FooterProps {
  companyName: string;
  socialLinks?: { platform: string; url: string }[];
  copyrightText?: string;
}

export interface SectionBase {
  id: number;
  name: string;
  type: 'header' | 'form' | 'footer';
}

export interface HeaderSection extends SectionBase {
  type: 'header';
  properties: HeaderProps;
}

export interface FormSection extends SectionBase {
  type: 'form';
  properties: FormProps;
}

export interface FooterSection extends SectionBase {
  type: 'footer';
  properties: FooterProps;
}

export type Section = HeaderSection | FormSection | FooterSection;

export interface LayoutState {
  header: Section[];
  form: Section[];
  footer: Section[];
}

export interface PageConfig {
  sections: Section[];
  lastModified: string;
}
