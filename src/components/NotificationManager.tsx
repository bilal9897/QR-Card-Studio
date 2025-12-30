import { useState, useEffect } from 'react';
import { Bell, BellOff, X, Clock, Trash2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedDesign {
  id: string;
  name: string;
  savedAt: number;
  reminderAt?: number;
}

interface NotificationManagerProps {
  businessName: string;
  onSaveDesign?: () => void;
}

export default function NotificationManager({ businessName }: NotificationManagerProps) {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [reminderHours, setReminderHours] = useState(24);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load saved designs from localStorage
    const saved = localStorage.getItem('qr-card-saved-designs');
    if (saved) {
      setSavedDesigns(JSON.parse(saved));
    }

    // Check for due reminders
    checkReminders();
  }, []);

  const checkReminders = () => {
    const saved = localStorage.getItem('qr-card-saved-designs');
    if (!saved) return;

    const designs: SavedDesign[] = JSON.parse(saved);
    const now = Date.now();

    designs.forEach(design => {
      if (design.reminderAt && design.reminderAt <= now) {
        showNotification(design.name);
        // Clear the reminder
        design.reminderAt = undefined;
      }
    });

    localStorage.setItem('qr-card-saved-designs', JSON.stringify(designs));
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Not supported',
        description: 'Your browser does not support notifications.',
        variant: 'destructive',
      });
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      toast({
        title: 'Notifications enabled',
        description: 'You\'ll receive reminders for your saved designs.',
      });
    } else if (result === 'denied') {
      toast({
        title: 'Notifications blocked',
        description: 'Enable notifications in your browser settings.',
        variant: 'destructive',
      });
    }
  };

  const showNotification = (designName: string) => {
    if (permission !== 'granted') return;

    new Notification('QR Card Studio Reminder', {
      body: `Don't forget to complete your "${designName}" card design!`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'design-reminder',
    });
  };

  const saveCurrentDesign = () => {
    const name = businessName || `Design ${savedDesigns.length + 1}`;
    const newDesign: SavedDesign = {
      id: Date.now().toString(),
      name,
      savedAt: Date.now(),
    };

    const updated = [...savedDesigns, newDesign];
    setSavedDesigns(updated);
    localStorage.setItem('qr-card-saved-designs', JSON.stringify(updated));

    toast({
      title: 'Design saved',
      description: 'Your card design has been saved locally.',
    });
  };

  const setReminder = (designId: string) => {
    if (permission !== 'granted') {
      requestPermission();
      return;
    }

    const reminderTime = Date.now() + (reminderHours * 60 * 60 * 1000);
    const updated = savedDesigns.map(d => 
      d.id === designId ? { ...d, reminderAt: reminderTime } : d
    );
    
    setSavedDesigns(updated);
    localStorage.setItem('qr-card-saved-designs', JSON.stringify(updated));

    // Schedule notification using setTimeout
    const delay = reminderHours * 60 * 60 * 1000;
    const design = savedDesigns.find(d => d.id === designId);
    
    if (design && delay < 24 * 60 * 60 * 1000) { // Only for delays < 24h
      setTimeout(() => {
        showNotification(design.name);
      }, delay);
    }

    toast({
      title: 'Reminder set',
      description: `You'll be reminded in ${reminderHours} hour${reminderHours > 1 ? 's' : ''}.`,
    });
  };

  const deleteDesign = (designId: string) => {
    const updated = savedDesigns.filter(d => d.id !== designId);
    setSavedDesigns(updated);
    localStorage.setItem('qr-card-saved-designs', JSON.stringify(updated));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors focus-ring ${
          showPanel 
            ? 'bg-accent/10 text-accent border border-accent/30' 
            : 'bg-secondary/50 text-muted-foreground hover:text-foreground border border-border'
        }`}
        aria-expanded={showPanel}
      >
        {permission === 'granted' ? (
          <Bell className="w-3.5 h-3.5" />
        ) : (
          <BellOff className="w-3.5 h-3.5" />
        )}
        <span>Reminders</span>
        {savedDesigns.length > 0 && (
          <span className="bg-accent/20 text-accent px-1.5 py-0.5 text-[10px] font-medium rounded-full">
            {savedDesigns.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {showPanel && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border shadow-xl z-50 animate-fade-in">
          {/* Header */}
          <div className="p-3 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-sm text-foreground">Saved Designs</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notification permission */}
          {permission !== 'granted' && (
            <div className="p-3 bg-accent/5 border-b border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Enable notifications to receive reminders
              </p>
              <button
                onClick={requestPermission}
                className="btn-secondary text-xs px-3 py-1.5 w-full"
              >
                <Bell className="w-3.5 h-3.5 mr-1.5" />
                Enable Notifications
              </button>
            </div>
          )}

          {/* Save current design */}
          <div className="p-3 border-b border-border">
            <button
              onClick={saveCurrentDesign}
              className="btn-primary text-xs px-3 py-2 w-full"
            >
              Save Current Design
            </button>
          </div>

          {/* Saved designs list */}
          <div className="max-h-64 overflow-y-auto">
            {savedDesigns.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground text-center">
                No saved designs yet. Save your work to set reminders.
              </p>
            ) : (
              savedDesigns.map(design => (
                <div key={design.id} className="p-3 border-b border-border/50 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-foreground truncate max-w-[180px]">
                        {design.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Saved {formatDate(design.savedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      aria-label="Delete design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {design.reminderAt ? (
                    <div className="flex items-center gap-1.5 text-xs text-success">
                      <Check className="w-3.5 h-3.5" />
                      Reminder: {formatDate(design.reminderAt)}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={reminderHours}
                        onChange={(e) => setReminderHours(Number(e.target.value))}
                        className="text-xs bg-secondary/50 border border-border px-2 py-1 flex-1"
                      >
                        <option value={1}>1 hour</option>
                        <option value={4}>4 hours</option>
                        <option value={24}>24 hours</option>
                        <option value={48}>2 days</option>
                        <option value={168}>1 week</option>
                      </select>
                      <button
                        onClick={() => setReminder(design.id)}
                        className="btn-secondary text-xs px-2 py-1 flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        Set
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
