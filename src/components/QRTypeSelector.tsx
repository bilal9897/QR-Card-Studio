import { useState } from 'react';
import { Link, User, Wifi, Calendar, Smartphone, ChevronDown, ChevronUp, Image, Upload, Loader2 } from 'lucide-react';
import {
    type QRType,
    type QRData,
    type URLData,
    type VCardData,
    type WiFiData,
    type CalendarData,
    type MultiURLData,
    type ImageData,
    QR_TYPES,
    validateQRData,
} from '@/lib/qr-types';

interface QRTypeSelectorProps {
    selectedType: QRType;
    qrData: QRData;
    onTypeChange: (type: QRType) => void;
    onDataChange: (data: QRData) => void;
}

const ICON_MAP = {
    Link,
    User,
    Wifi,
    Calendar,
    Smartphone,
    Image,
};

export default function QRTypeSelector({
    selectedType,
    qrData,
    onTypeChange,
    onDataChange,
}: QRTypeSelectorProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleTypeSelect = (type: QRType) => {
        onTypeChange(type);
        setIsExpanded(false);

        // Initialize with default data for the selected type
        switch (type) {
            case 'url':
                onDataChange({ url: '' } as URLData);
                break;
            case 'vcard':
                onDataChange({ firstName: '', lastName: '' } as VCardData);
                break;
            case 'wifi':
                onDataChange({ ssid: '', password: '', encryption: 'WPA' } as WiFiData);
                break;
            case 'calendar':
                onDataChange({ title: '', startDate: '', endDate: '' } as CalendarData);
                break;
            case 'multi-url':
                onDataChange({ iosUrl: '', androidUrl: '', fallbackUrl: '' } as MultiURLData);
                break;
            case 'image':
                onDataChange({ imageUrl: '' } as ImageData);
                break;
        }
    };

    const selectedTypeInfo = QR_TYPES.find(t => t.id === selectedType);
    const IconComponent = selectedTypeInfo ? ICON_MAP[selectedTypeInfo.icon as keyof typeof ICON_MAP] : Link;

    return (
        <div className="space-y-4">
            {/* Type Selector Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-accent/50 transition-colors focus-ring"
                    aria-expanded={isExpanded}
                >
                    <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-accent" />
                        <div className="text-left">
                            <p className="font-medium text-sm">{selectedTypeInfo?.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedTypeInfo?.description}</p>
                        </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                </button>

                {/* Dropdown Menu */}
                {isExpanded && (
                    <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
                        {QR_TYPES.map((type) => {
                            const Icon = ICON_MAP[type.icon as keyof typeof ICON_MAP];
                            const isSelected = type.id === selectedType;

                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => handleTypeSelect(type.id)}
                                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${isSelected
                                        ? 'bg-accent/10 border-l-2 border-accent'
                                        : 'hover:bg-secondary/50'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                                    <div className="flex-1">
                                        <p className={`font-medium text-sm ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                                            {type.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{type.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Type-Specific Forms */}
            <div className="space-y-4">
                {selectedType === 'url' && (
                    <URLForm data={qrData as URLData} onChange={onDataChange} />
                )}
                {selectedType === 'vcard' && (
                    <VCardForm data={qrData as VCardData} onChange={onDataChange} />
                )}
                {selectedType === 'wifi' && (
                    <WiFiForm data={qrData as WiFiData} onChange={onDataChange} />
                )}
                {selectedType === 'calendar' && (
                    <CalendarForm data={qrData as CalendarData} onChange={onDataChange} />
                )}
                {selectedType === 'multi-url' && (
                    <MultiURLForm data={qrData as MultiURLData} onChange={onDataChange} />
                )}
                {selectedType === 'image' && (
                    <ImageForm data={qrData as ImageData} onChange={onDataChange} />
                )}
            </div>
        </div>
    );
}

// ============================================
// Type-Specific Forms
// ============================================

function URLForm({ data, onChange }: { data: URLData; onChange: (data: QRData) => void }) {
    return (
        <div>
            <label htmlFor="qr-url" className="block text-sm font-medium mb-2">
                Website URL <span className="text-destructive">*</span>
            </label>
            <input
                id="qr-url"
                type="url"
                value={data.url}
                onChange={(e) => onChange({ ...data, url: e.target.value })}
                placeholder="https://example.com/feedback"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
        </div>
    );
}

function VCardForm({ data, onChange }: { data: VCardData; onChange: (data: QRData) => void }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="vcard-firstname" className="block text-sm font-medium mb-2">
                        First Name <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="vcard-firstname"
                        type="text"
                        value={data.firstName}
                        onChange={(e) => onChange({ ...data, firstName: e.target.value })}
                        placeholder="John"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div>
                    <label htmlFor="vcard-lastname" className="block text-sm font-medium mb-2">
                        Last Name <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="vcard-lastname"
                        type="text"
                        value={data.lastName}
                        onChange={(e) => onChange({ ...data, lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="vcard-org" className="block text-sm font-medium mb-2">
                        Organization
                    </label>
                    <input
                        id="vcard-org"
                        type="text"
                        value={data.organization || ''}
                        onChange={(e) => onChange({ ...data, organization: e.target.value })}
                        placeholder="Acme Inc."
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div>
                    <label htmlFor="vcard-title" className="block text-sm font-medium mb-2">
                        Job Title
                    </label>
                    <input
                        id="vcard-title"
                        type="text"
                        value={data.title || ''}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="CEO"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="vcard-phone" className="block text-sm font-medium mb-2">
                        Phone
                    </label>
                    <input
                        id="vcard-phone"
                        type="tel"
                        value={data.phone || ''}
                        onChange={(e) => onChange({ ...data, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div>
                    <label htmlFor="vcard-email" className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        id="vcard-email"
                        type="email"
                        value={data.email || ''}
                        onChange={(e) => onChange({ ...data, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="vcard-website" className="block text-sm font-medium mb-2">
                    Website
                </label>
                <input
                    id="vcard-website"
                    type="url"
                    value={data.website || ''}
                    onChange={(e) => onChange({ ...data, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
            </div>

            <div>
                <label htmlFor="vcard-address" className="block text-sm font-medium mb-2">
                    Street Address
                </label>
                <input
                    id="vcard-address"
                    type="text"
                    value={data.address || ''}
                    onChange={(e) => onChange({ ...data, address: e.target.value })}
                    placeholder="123 Main St"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label htmlFor="vcard-city" className="block text-sm font-medium mb-2">
                        City
                    </label>
                    <input
                        id="vcard-city"
                        type="text"
                        value={data.city || ''}
                        onChange={(e) => onChange({ ...data, city: e.target.value })}
                        placeholder="New York"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div>
                    <label htmlFor="vcard-state" className="block text-sm font-medium mb-2">
                        State
                    </label>
                    <input
                        id="vcard-state"
                        type="text"
                        value={data.state || ''}
                        onChange={(e) => onChange({ ...data, state: e.target.value })}
                        placeholder="NY"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div>
                    <label htmlFor="vcard-zip" className="block text-sm font-medium mb-2">
                        ZIP
                    </label>
                    <input
                        id="vcard-zip"
                        type="text"
                        value={data.zip || ''}
                        onChange={(e) => onChange({ ...data, zip: e.target.value })}
                        placeholder="10001"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
            </div>
        </div>
    );
}

function WiFiForm({ data, onChange }: { data: WiFiData; onChange: (data: QRData) => void }) {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="wifi-ssid" className="block text-sm font-medium mb-2">
                    Network Name (SSID) <span className="text-destructive">*</span>
                </label>
                <input
                    id="wifi-ssid"
                    type="text"
                    value={data.ssid}
                    onChange={(e) => onChange({ ...data, ssid: e.target.value })}
                    placeholder="Guest WiFi"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
            </div>

            <div>
                <label htmlFor="wifi-encryption" className="block text-sm font-medium mb-2">
                    Security Type <span className="text-destructive">*</span>
                </label>
                <select
                    id="wifi-encryption"
                    value={data.encryption}
                    onChange={(e) => onChange({ ...data, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                </select>
            </div>

            {data.encryption !== 'nopass' && (
                <div>
                    <label htmlFor="wifi-password" className="block text-sm font-medium mb-2">
                        Password <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="wifi-password"
                        type="text"
                        value={data.password}
                        onChange={(e) => onChange({ ...data, password: e.target.value })}
                        placeholder="Enter WiFi password"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
            )}

            <div className="flex items-center gap-3">
                <input
                    id="wifi-hidden"
                    type="checkbox"
                    checked={data.hidden || false}
                    onChange={(e) => onChange({ ...data, hidden: e.target.checked })}
                    className="w-4 h-4 accent-accent"
                />
                <label htmlFor="wifi-hidden" className="text-sm">
                    Hidden network
                </label>
            </div>
        </div>
    );
}

function CalendarForm({ data, onChange }: { data: CalendarData; onChange: (data: QRData) => void }) {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="cal-title" className="block text-sm font-medium mb-2">
                    Event Title <span className="text-destructive">*</span>
                </label>
                <input
                    id="cal-title"
                    type="text"
                    value={data.title}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                    placeholder="Team Meeting"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
            </div>

            <div>
                <label htmlFor="cal-description" className="block text-sm font-medium mb-2">
                    Description
                </label>
                <textarea
                    id="cal-description"
                    value={data.description || ''}
                    onChange={(e) => onChange({ ...data, description: e.target.value })}
                    placeholder="Discuss Q1 goals"
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                />
            </div>

            <div>
                <label htmlFor="cal-location" className="block text-sm font-medium mb-2">
                    Location
                </label>
                <input
                    id="cal-location"
                    type="text"
                    value={data.location || ''}
                    onChange={(e) => onChange({ ...data, location: e.target.value })}
                    placeholder="Conference Room A"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="cal-start" className="block text-sm font-medium mb-2">
                        Start Date & Time <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="cal-start"
                        type="datetime-local"
                        value={data.startDate}
                        onChange={(e) => onChange({ ...data, startDate: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div>
                    <label htmlFor="cal-end" className="block text-sm font-medium mb-2">
                        End Date & Time <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="cal-end"
                        type="datetime-local"
                        value={data.endDate}
                        onChange={(e) => onChange({ ...data, endDate: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
            </div>
        </div>
    );
}

function MultiURLForm({ data, onChange }: { data: MultiURLData; onChange: (data: QRData) => void }) {
    return (
        <div className="space-y-4">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                    Create a smart QR code that redirects to different URLs based on the device type (iOS, Android, or Desktop).
                </p>
            </div>

            <div>
                <label htmlFor="multi-ios" className="block text-sm font-medium mb-2">
                    iOS URL (App Store) <span className="text-destructive">*</span>
                </label>
                <input
                    id="multi-ios"
                    type="url"
                    value={data.iosUrl}
                    onChange={(e) => onChange({ ...data, iosUrl: e.target.value })}
                    placeholder="https://apps.apple.com/app/..."
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
            </div>

            <div>
                <label htmlFor="multi-android" className="block text-sm font-medium mb-2">
                    Android URL (Play Store) <span className="text-destructive">*</span>
                </label>
                <input
                    id="multi-android"
                    type="url"
                    value={data.androidUrl}
                    onChange={(e) => onChange({ ...data, androidUrl: e.target.value })}
                    placeholder="https://play.google.com/store/apps/..."
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
            </div>

            <div>
                <label htmlFor="multi-fallback" className="block text-sm font-medium mb-2">
                    Fallback URL (Desktop/Other) <span className="text-destructive">*</span>
                </label>
                <input
                    id="multi-fallback"
                    type="url"
                    value={data.fallbackUrl}
                    onChange={(e) => onChange({ ...data, fallbackUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
            </div>
        </div>
    );
}

function ImageForm({ data, onChange }: { data: ImageData; onChange: (data: QRData) => void }) {
    return (
        <div className="space-y-4">
            <div className="p-3 bg-secondary/50 border border-border rounded-lg">
                <p className="text-xs text-muted-foreground">
                    Link to any image hosted online (Google Drive, Imgur, Dropbox, etc).
                    The QR code will open the image directly when scanned.
                </p>
            </div>

            <div>
                <label htmlFor="image-url" className="block text-sm font-medium mb-2">
                    Image Link <span className="text-destructive">*</span>
                </label>
                <input
                    id="image-url"
                    type="url"
                    value={data.imageUrl}
                    onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
                    placeholder="https://i.imgur.com/..."
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">
                    Tip: Use direct image links ending in .jpg or .png for best results.
                </p>
            </div>
        </div>
    );
}

