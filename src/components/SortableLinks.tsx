import React, { FC } from 'react';
import { Card } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MenuItem {
    label: string;
    url: string;
}

interface FormField {
    type: 'text' | 'email' | 'password' | 'textarea' | 'submit';
    label: string;
    placeholder?: string;
}

interface SocialLink {
    platform: string;
    url: string;
}

interface HeaderProps {
    title: string;
    subtitle?: string;
    logoUrl?: string;
    menuItems?: MenuItem[];
}

interface FormProps {
    title: string;
    description?: string;
    fields: FormField[];
}

interface FooterProps {
    companyName: string;
    copyrightText?: string;
    socialLinks?: SocialLink[];
}

interface Item {
    id: number;
    name: string;
    type: 'header' | 'form' | 'footer';
    fieldType?: string;
    properties: HeaderProps | FormProps | FooterProps;
}

interface SortableLinkCardProps {
    id: Item;
    onDelete: (id: number) => void;
}

const SortableLinks: FC<SortableLinkCardProps> = ({ id, onDelete }) => {
    const uniqueId = id.id;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: uniqueId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleButtonClick = () => {
        onDelete(uniqueId);
    };

    const isCursorGrabbing = attributes['aria-pressed'];

    const getBlockStyle = (type: 'header' | 'form' | 'footer') => {
        switch (type) {
            case 'header':
                return 'bg-blue-50 border-blue-200';
            case 'form':
                return 'bg-green-50 border-green-200';
            case 'footer':
                return 'bg-purple-50 border-purple-200';
        }
    };

    const renderContent = () => {
        if (!id.properties) return null;

        switch (id.type) {
            case 'header':
                const headerProps = id.properties as HeaderProps;
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-4">
                            <div>
                                <h1 className="text-2xl font-bold">{headerProps.title}</h1>
                                {headerProps.subtitle && (
                                    <p className="text-gray-600">{headerProps.subtitle}</p>
                                )}
                            </div>
                            {headerProps.logoUrl && (
                                <img src={headerProps.logoUrl} alt="Logo" className="h-8 w-auto" />
                            )}
                        </div>
                        {headerProps.menuItems && (
                            <nav className="flex gap-4">
                                {headerProps.menuItems.map((item, index) => (
                                    <a key={index} href={item.url} className="text-blue-600 hover:text-blue-800">
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        )}
                    </div>
                );

            case 'form':
                const formProps = id.properties as FormProps;
                console.log('Form Props:', formProps);
                
                return (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">{formProps.title}</h2>
                            {formProps.description && (
                                <p className="text-gray-600">{formProps.description}</p>
                            )}
                        </div>
                        <div className="space-y-3">
                            {formProps.fields.map((field, index) => (
                                <div key={index} className="space-y-1">
                                    <label className="text-sm font-medium">{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <div className="h-24 bg-white rounded border border-gray-200"></div>
                                    ) : field.type === 'submit' ? (
                                        <button className="w-full py-2 bg-blue-600 text-white rounded">
                                            {field.label}
                                        </button>
                                    ) : (
                                        <div className="h-10 bg-white rounded border border-gray-200"></div>
                                    )}
                                </div>
                            )
                            )}
                        </div>
                    </div>
                );

            case 'footer':
                const footerProps = id.properties as FooterProps;
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{footerProps.companyName}</h3>
                                <p className="text-sm text-gray-600">{footerProps.copyrightText}</p>
                            </div>
                            {footerProps.socialLinks && (
                                <div className="flex gap-3">
                                    {footerProps.socialLinks.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className="text-gray-600 hover:text-gray-900"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.platform}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div ref={setNodeRef} style={style} key={uniqueId}>
            <Card className={`relative group border-2 ${getBlockStyle(id.type)}`}>
                <div className="absolute right-2 top-2 flex gap-2 z-10">
                    <button className="hidden group-hover:block bg-white rounded-full p-1 shadow-sm" onClick={handleButtonClick}>
                        <svg className='text-red-500' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                    <button 
                        {...attributes} 
                        {...listeners} 
                        className={`bg-white rounded-full p-1 shadow-sm ${isCursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
                        aria-describedby={`DndContext-${uniqueId}`}
                    >
                        <svg viewBox="0 0 20 20" width="15">
                            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                                fill="currentColor"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};

export default SortableLinks;
