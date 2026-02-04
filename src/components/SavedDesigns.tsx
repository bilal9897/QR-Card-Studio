import { useState, useEffect } from 'react';
import { Save, Trash2, Copy, FolderOpen, Clock, MoreVertical, Edit2, Plus } from 'lucide-react';
import { type SavedDesign, getDesigns, deleteDesign, saveDesign } from '@/lib/storage';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SavedDesignsProps {
    onLoad: (design: SavedDesign) => void;
    onClose: () => void;
    currentDesign?: Omit<SavedDesign, 'id' | 'createdAt' | 'updatedAt'>;
}

export default function SavedDesigns({ onLoad, onClose, currentDesign }: SavedDesignsProps) {
    const { toast } = useToast();
    const [designs, setDesigns] = useState<SavedDesign[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [newDesignName, setNewDesignName] = useState('');
    const [showSaveForm, setShowSaveForm] = useState(false);

    useEffect(() => {
        loadDesigns();
    }, []);

    const loadDesigns = () => {
        setDesigns(getDesigns());
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentDesign || !newDesignName.trim()) return;

        try {
            saveDesign({
                ...currentDesign,
                name: newDesignName,
            });
            toast({
                title: 'Design saved',
                description: 'Your card design has been saved successfully.',
            });
            setNewDesignName('');
            setShowSaveForm(false);
            loadDesigns();
        } catch (error) {
            toast({
                title: 'Error saving',
                description: 'Failed to save design.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this design?')) {
            deleteDesign(id);
            loadDesigns();
            toast({
                title: 'Design deleted',
                description: 'The design has been removed.',
            });
        }
    };

    const handleDuplicate = (design: SavedDesign, e: React.MouseEvent) => {
        e.stopPropagation();
        saveDesign({
            name: `${design.name} (Copy)`,
            data: design.data,
        });
        loadDesigns();
        toast({
            title: 'Design duplicated',
            description: 'A copy of your design has been created.',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-md h-full bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-accent" />
                        <h2 className="font-semibold text-lg">Saved Designs</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        Wait
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Save Current Action */}
                    {currentDesign && !showSaveForm && (
                        <button
                            onClick={() => setShowSaveForm(true)}
                            className="w-full py-3 px-4 bg-accent/10 border border-accent/20 rounded-lg text-accent hover:bg-accent/20 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Save Current Design
                        </button>
                    )}

                    {/* Save Form */}
                    {showSaveForm && (
                        <form onSubmit={handleSave} className="p-4 bg-secondary/30 rounded-lg border border-border space-y-3">
                            <h3 className="text-sm font-medium">Save New Design</h3>
                            <input
                                type="text"
                                value={newDesignName}
                                onChange={e => setNewDesignName(e.target.value)}
                                placeholder=" e.g., Summer Menu 2024"
                                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowSaveForm(false)}
                                    className="px-3 py-1.5 text-xs font-medium hover:bg-secondary rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newDesignName.trim()}
                                    className="px-3 py-1.5 text-xs font-medium bg-accent text-accent-foreground rounded-md disabled:opacity-50 transition-colors"
                                >
                                    Save Design
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Designs List */}
                    <div className="space-y-3">
                        {designs.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No saved designs yet.</p>
                                <p className="text-sm mt-1">Save your current work to access it later.</p>
                            </div>
                        ) : (
                            designs.map((design) => (
                                <div
                                    key={design.id}
                                    onClick={() => {
                                        onLoad(design);
                                        onClose();
                                    }}
                                    className="group relative p-4 bg-card border border-border rounded-lg hover:border-accent/50 transition-all cursor-pointer hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                                                {design.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Updated {formatDistanceToNow(design.updatedAt, { addSuffix: true })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleDuplicate(design, e)}
                                                className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(design.id, e)}
                                                className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground/80 line-clamp-1">
                                        {design.data.businessName || 'Untitled Business'} • {design.data.qrType.toUpperCase()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
