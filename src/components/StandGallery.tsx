import { MessageCircle } from 'lucide-react';
import restaurantStand from '@/assets/gallery/restaurant-stand.jpg';
import salonCounter from '@/assets/gallery/salon-counter.jpg';
import cafeTable from '@/assets/gallery/cafe-table.jpg';
import retailCounter from '@/assets/gallery/retail-counter.jpg';

const galleryItems = [
  {
    id: 'restaurant',
    image: restaurantStand,
    caption: 'Restaurant table feedback stand',
    alt: 'Elegant acrylic QR code stand on restaurant table',
  },
  {
    id: 'salon',
    image: salonCounter,
    caption: 'Salon counter QR stand',
    alt: 'Modern QR code stand at salon reception',
  },
  {
    id: 'cafe',
    image: cafeTable,
    caption: 'Café billing desk QR',
    alt: 'Small QR card stand on cafe table',
  },
  {
    id: 'retail',
    image: retailCounter,
    caption: 'Retail counter feedback card',
    alt: 'QR feedback card on retail checkout counter',
  },
];

const WHATSAPP_NUMBER = '919627897600';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi, I want to order QR feedback stands or bulk cards for my business.'
);

export default function StandGallery() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <section 
      className="py-16 lg:py-24 bg-secondary/30"
      aria-labelledby="gallery-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-accent mb-3">
            Real World Usage
          </p>
          <h2 
            id="gallery-heading"
            className="font-serif text-display-sm md:text-display-md text-foreground mb-4"
          >
            How it looks in <span className="italic">real life</span>
          </h2>
          <p className="text-muted-foreground">
            Premium QR feedback stands designed to blend seamlessly 
            with your business environment.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {galleryItems.map((item) => (
            <figure 
              key={item.id}
              className="group relative overflow-hidden bg-card border border-border"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <figcaption className="p-3 lg:p-4 text-center">
                <p className="text-sm text-foreground font-medium">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-xl mx-auto">
          <p className="text-lg text-foreground mb-4">
            Want these stands printed or ordered in bulk?
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Get custom-branded QR stands, acrylic displays, or bulk feedback cards 
            for your business.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            Order via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
